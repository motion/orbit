import AVFoundation
import AppKit

enum ApertureError: Error {
  case invalidAudioDevice
  case couldNotAddScreen
  case couldNotAddMic
  case couldNotAddOutput
}

struct Box: Decodable {
  let id: String
  let x: Int
  let y: Int
  let width: Int
  let height: Int
  let screenDir: String?
  let findContent: Bool
  let initialScreenshot: Bool
}

func applyFilter(_ filter: CIFilter?, for image: CIImage) -> CIImage {
  guard let filter = filter else { return image }
  filter.setValue(image, forKey: kCIInputImageKey)
  guard let filteredImage = filter.value(forKey: kCIOutputImageKey) else { return image }
  return filteredImage as! CIImage
}

func pixelValues(fromCGImage imageRef: CGImage?) -> (pixelValues: [UInt8]?, width: Int, height: Int) {
  var width = 0
  var height = 0
  var pixelValues: [UInt8]?
  if let imageRef = imageRef {
    width = imageRef.width
    height = imageRef.height
    let bitsPerComponent = imageRef.bitsPerComponent
    let bytesPerRow = imageRef.bytesPerRow
    let totalBytes = height * bytesPerRow
    let colorSpace = CGColorSpaceCreateDeviceGray()
    var intensities = [UInt8](repeating: 0, count: totalBytes)
    let contextRef = CGContext(data: &intensities, width: width, height: height, bitsPerComponent: bitsPerComponent, bytesPerRow: bytesPerRow, space: colorSpace, bitmapInfo: 0)
    contextRef?.draw(imageRef, in: CGRect(x: 0.0, y: 0.0, width: CGFloat(width), height: CGFloat(height)))
    pixelValues = intensities
  }
  return (pixelValues, width, height)
}

final class Recorder: NSObject {
  private let input: AVCaptureScreenInput
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var sensitivity: Int
  private var sampleSpacing: Int
  private var firstTime: Bool
  private let context = CIContext()
  private var boxes: [String: Box]
  private var lastBoxes: [String: Array<UInt32>]
  private let displayId: CGDirectDisplayID

  var onStart: (() -> Void)?
  var onFinish: (() -> Void)?
  var onError: ((Error) -> Void)?

  var isRecording: Bool {
    return false
  }

  var isPaused: Bool {
    return false
  }
  
  func onFrame(image: CGImage) {
    print("captured")
  }

  init(fps: Int, boxes: Array<Box>, showCursor: Bool, displayId: CGDirectDisplayID = CGMainDisplayID(), videoCodec: String? = nil, sampleSpacing: Int, sensitivity: Int) throws {
    self.displayId = displayId
    self.session = AVCaptureSession()
    self.firstTime = true
    self.sampleSpacing = sampleSpacing
    self.sensitivity = sensitivity
    self.lastBoxes = [String: Array<UInt32>]()
    self.boxes = [String: Box]()
    for box in boxes {
      self.boxes[box.id] = box
    }
    self.input = AVCaptureScreenInput(displayID: displayId)
    output = AVCaptureVideoDataOutput()
    
    super.init()
    
    self.setFPS(fps: fps)
    self.input.capturesCursor = showCursor
    
    output.alwaysDiscardsLateVideoFrames = true
    let queue = DispatchQueue(label: "com.shu223.videosamplequeue")
    output.setSampleBufferDelegate(self, queue: queue)

    if session.canAddInput(self.input) {
      session.addInput(self.input)
    } else {
      throw ApertureError.couldNotAddScreen
    }

    if session.canAddOutput(output) {
      session.addOutput(output)
    } else {
      throw ApertureError.couldNotAddOutput
    }
  }

  func start() {
    session.startRunning()
  }

  func stop() {
    session.stopRunning()
  }
  
  func setFPS(fps: Int) {
    self.input.minFrameDuration = CMTimeMake(1, Int32(fps))
  }

  // specialized filter that is best for finding the big area of content
  func filterImageForContentFinding(image: CGImage) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    var filter: CIFilter
    // make it black and white
    filter = CIFilter(name: "CIPhotoEffectNoir")!
    outputImage = applyFilter(filter, for: outputImage)
    // super lower contrast down to get rid of subtle color differences
    // this generally will preserve outline data as well
    filter = CIFilter(name: "CIColorControls")!
    filter.setValue(1.5, forKey: "inputContrast")
    outputImage = applyFilter(filter, for: outputImage)
    // this distinguishes things nicely for edge detection
    // helps prevent finding edges of contiguous blocks
    // while emphasizing edges of that have actual borders
    filter = CIFilter(name: "CIUnsharpMask")!
    filter.setValue(0.5, forKey: "inputIntensity")
    filter.setValue(2.5, forKey: "inputRadius")
    outputImage = applyFilter(filter, for: outputImage)
    // edge detecting with low contrast and unsharp mask
    // gives really nice outlines
    filter = CIFilter(name: "CIEdges")!
    filter.setValue(10.0, forKey: "inputIntensity")
    outputImage = applyFilter(filter, for: outputImage)
    // edges inversts everything basically, so lets un-invert
    filter = CIFilter(name: "CIColorInvert")!
    outputImage = applyFilter(filter, for: outputImage)
    // motion blur one pixel in each direction,
    // this will ensure that rounded borders and sketchy outlines
    // will still connect to each other for the component finding
    filter = CIFilter(name: "CIMotionBlur")!
    filter.setValue(1.0, forKey: "inputRadius")
    filter.setValue(0.0, forKey: "inputAngle")
    outputImage = applyFilter(filter, for: outputImage)
    // motion blur vertical
    filter = CIFilter(name: "CIMotionBlur")!
    filter.setValue(1.0, forKey: "inputRadius")
    filter.setValue(0.5, forKey: "inputAngle")
    outputImage = applyFilter(filter, for: outputImage)
    // threshold binarizes the image
    outputImage = applyFilter(ThresholdFilter(), for: outputImage)
    // write canvas
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
  // filter that binarizes for individual character finding
  func filterImageForOCRCharacterFinding(image: CGImage) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    var filter: CIFilter
    // noir
    filter = CIFilter(name: "CIPhotoEffectNoir")!
    outputImage = applyFilter(filter, for: outputImage)
    // unsharpen
    filter = CIFilter(name: "CIUnsharpMask")!
    filter.setValue(0.5, forKey: "inputIntensity")
    filter.setValue(2.5, forKey: "inputRadius")
    outputImage = applyFilter(filter, for: outputImage)
    // threshold
    outputImage = applyFilter(ThresholdFilter(), for: outputImage)
    // write
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
  // filter just for writing out, optimized for our OCR engine
  func filterImageForOCR(image: CGImage) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    var filter: CIFilter
    // noir
    filter = CIFilter(name: "CIPhotoEffectNoir")!
    outputImage = applyFilter(filter, for: outputImage)
    // threshold
    outputImage = applyFilter(ThresholdBelowFilter(), for: outputImage)
    // write
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
  func writeCGImage(image: CGImage, to destination: String) {
    let destinationURL = URL(fileURLWithPath: destination)
    guard let finalDestination = CGImageDestinationCreateWithURL(destinationURL as CFURL, kUTTypePNG, 1, nil) else { return }
    let resolution = 300
    let properties: NSDictionary = [
      kCGImageDestinationLossyCompressionQuality: 1,
      kCGImagePropertyDPIHeight: resolution,
      kCGImagePropertyDPIWidth: resolution
    ]
    CGImageDestinationAddImage(finalDestination, image, properties)
    CGImageDestinationFinalize(finalDestination)
  }

  func resize(_ image: NSImage, w: Int, h: Int) -> NSImage {
    let destSize = NSMakeSize(CGFloat(w), CGFloat(h))
    let newImage = NSImage(size: destSize)
    newImage.lockFocus()
    image.draw(in: NSMakeRect(0, 0, destSize.width, destSize.height), from: NSMakeRect(0, 0, image.size.width, image.size.height), operation: NSCompositingOperation.sourceOver, fraction: CGFloat(1))
    newImage.unlockFocus()
    newImage.size = destSize
    return NSImage(data: newImage.tiffRepresentation!)!
  }

  func cropImage(_ image: CGImage, box: CGRect) -> CGImage {
    return image.cropping(to: box)!
  }
  
  func screenshotBox(box: Box, buffer: CMSampleBuffer, findContent: Bool = false) {
//    let start = DispatchTime.now()
    if (box.screenDir != nil) {
      let outPath = "\(box.screenDir ?? "/tmp")/\(box.id).png"
      let cropRect = CGRect(
        x: box.x * 2,
        y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
        width: box.width * 2,
        height: Int(-box.height * 2)
      )
      guard let cgImageLarge = imageFromSampleBuffer(sampleBuffer: buffer, cropRect: cropRect) else {return }
      guard let cgImage = self.resize(cgImageLarge, width: Int(cropRect.width / 2), height: Int(cropRect.height / 2)) else { return }
      if (!findContent) {
        self.writeCGImage(image: cgImage, to: outPath)
        return
      }
      var biggestBox: BoundingBox?
      let binarizedImage = filterImageForContentFinding(image: cgImage)
      let cc = ConnectedComponents()
      let start = DispatchTime.now()
      let result = cc.labelImageFast(image: binarizedImage, calculateBoundingBoxes: true, invert: true)
      print("1. content finding: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      if let boxes = result.boundingBoxes {
        if (boxes.count > 0) {
          for box in boxes {
            if (biggestBox == nil || box.value.getSize() > biggestBox!.getSize()) {
              biggestBox = box.value
            }
          }
        }
      }
      // if no found content box, write full image
      if (biggestBox == nil) {
        self.writeCGImage(image: cgImage, to: outPath)
      }
      // found content
      let bb = biggestBox!
      let cropBox = CGRect(x: bb.x_start, y: bb.y_start, width: bb.getWidth(), height: bb.getHeight())
      let cropBoxLarge = CGRect(x: bb.x_start * 2, y: bb.y_start * 2, width: bb.getWidth() * 2, height: bb.getHeight() * 2)
      print("! [\(cropBox.minX), \(cropBox.minY), \(cropBox.width), \(cropBox.height)]")
      // if we are writing out
      if (box.screenDir != nil) {
        var start = DispatchTime.now()
        let ocrWriteImage = self.cropImage(filterImageForOCR(image: cgImageLarge), box: cropBoxLarge)
        let ocrCharactersImage = self.cropImage(filterImageForOCRCharacterFinding(image: cgImage), box: cropBox)
        print("2. filtering image for ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
        start = DispatchTime.now()
        self.writeCharacters(binarizedImage: ocrCharactersImage, outputImage: ocrWriteImage, to: box.screenDir!)
        // for testing write out og image too
        print("writing screenshot to \(outPath): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
        self.writeCGImage(image: ocrWriteImage, to: outPath)
        self.writeCGImage(image: ocrCharactersImage, to: "\(box.screenDir!)/\(box.id)-binarized.png")
      }
    }
//    print("screenshotBox total: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
  }
  
  func writeCharacters(binarizedImage: CGImage, outputImage: CGImage, to outDir: String) {
    var start = DispatchTime.now()
    let cc = ConnectedComponentsSwiftOCR()
    let nsBinarizedImage = NSImage.init(cgImage: binarizedImage, size: NSZeroSize)
    let rects = cc.extractBlobs(nsBinarizedImage)
    print("3. character finding: \(rects.count), \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    let outputImageRep = NSBitmapImageRep.init(cgImage: outputImage)
    print("image is \(outputImageRep.pixelsWide) wide \(outputImageRep.pixelsHigh) tall")
    if rects.count > 0 {
      var pixelString = ""
      // loop over component
      for (index, rect) in rects.enumerated() {
        // testing: write out character image
        let image = binarizedImage.cropping(to: rect)!
        let image2 = self.resize(image, width: 28, height: 28)!
        let testImage = NSBitmapImageRep.init(cgImage: image2)
        // collect pixel values in component
        let minX = Int(rect.minX) * 2
        let minY = Int(rect.minY) * 2
        let width = Double(Int(rect.maxX) * 2 - minX)
        let height = Double(Int(rect.maxY) * 2 - minY)
        // make square
        var scaleW = 1.0
        var scaleH = 1.0
        if width > 56 {
          scaleW = 56 / width
        } else if width < 56 {
          scaleW = width / 56
        }
        if height > 56 {
          scaleH = 56 / height
        } else if height < 56 {
          scaleH = height / 56
        }
        scaleW = scaleW * 2.0
        scaleH = scaleH * 2.0
        // double for retina
        for x in 0..<56 {
          for y in 0..<56 {
            let realX = Int(Double(x) * scaleW + Double(minX))
            let realY = Int(Double(y) * scaleH + Double(minY))
            // debug info
            // print("rect is \(minX) \(minY) \(width) \(height)")
            // print("scaleW \(scaleW) scaleH \(scaleH)")
            // print("check \(realX) \(realY)")
            var pColor = outputImageRep.colorAt(x: realX, y: realY)
            if pColor == nil {
              // this happens if we are at an edge, because we are checking a full 28x28
              // we should just fill it in with white if not found
              pColor = NSColor.init(red: 0.0, green: 0.0, blue: 0.0, alpha: 1.0)
            }
            testImage.setColor(pColor!, atX: x, y: y)
            let luminance = (pColor!.redComponent + pColor!.greenComponent + pColor!.blueComponent) / 3
            pixelString += "\(luminance) "
          }
        }
        // test write out our scaled image
        self.writeCGImage(image: testImage.cgImage!, to: "\(outDir)/\(index).png")
        pixelString += "\n"
      }
      do {
        let path = NSURL.fileURL(withPath: "\(outDir)/characters.txt").absoluteURL
        try pixelString.write(to: path, atomically: true, encoding: .utf8)
      } catch {
        print("couldnt write pixel string \(error)")
      }
    }
    print("4. looping/writing characters.txt: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
  }
  
  func hasBoxChanged(box: Box, buffer: UnsafeMutablePointer<UInt32>, perRow: Int) -> Bool {
    let lastBox = self.lastBoxes[box.id]
    var hasLastBox = false
    let boxX = box.x
    let boxY = box.y
    let height = Int(box.height) / 2
    let width = Int(box.width) / 2
    var curBox: Array<UInt32> = []
    var numChanged = 0
    var shouldFinish = false
    let smallH = height/sampleSpacing
    let smallW = width/sampleSpacing
    if (lastBox != nil) {
      hasLastBox = lastBox?.count == smallW * smallH
    }
//    print("haslast \(hasLastBox)")
//    var lastIndex = 0
    for y in 0..<smallH {
      // iterate col first
      for x in 0..<smallW {
        let realY = y * sampleSpacing / 2 + boxY / 2
        let realX = x * sampleSpacing + boxX / 2
        let index = y * smallW + x
        let luma = buffer[realY * perRow + realX]
        if (hasLastBox) {
          if (lastBox![index] != luma) {
            numChanged = numChanged + 1
            if (numChanged > sensitivity) {
              shouldFinish = true
              break
            }
          }
        }
        curBox.insert(luma, at: index)
//        lastIndex = index
      }
      if (shouldFinish) {
        break
      }
    }
    self.lastBoxes[box.id] = curBox
    let hasChanged = shouldFinish
    if (hasChanged) {
      return true
    }
    return false
  }
  
  private func imageFromSampleBuffer(sampleBuffer: CMSampleBuffer, cropRect: CGRect) -> CGImage? {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return nil }
    var ciImage = CIImage(cvPixelBuffer: imageBuffer)
    ciImage = ciImage.cropped(to: cropRect)
    guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else { return nil }
    return cgImage
  }
  
  func resize(_ image: CGImage, width: Int, height: Int) -> CGImage? {
    var ratio: Float = 0.0
    let imageWidth = Float(image.width)
    let imageHeight = Float(image.height)
    let maxWidth: Float = Float(width)
    let maxHeight: Float = Float(height)
    // Get ratio (landscape or portrait)
    if (imageWidth > imageHeight) {
      ratio = maxWidth / imageWidth
    } else {
      ratio = maxHeight / imageHeight
    }
    // Calculate new size based on the ratio
    // this would prevent sizing it up but we want that
    //    if ratio > 1 {
    //      ratio = 1
    //    }
    let mWidth = imageWidth * ratio
    let mHeight = imageHeight * ratio
    guard let colorSpace = image.colorSpace else { return nil }
    guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: image.bitsPerComponent, bytesPerRow: image.bytesPerRow, space: colorSpace, bitmapInfo: image.alphaInfo.rawValue) else { return nil }
    // white background
    context.clear(CGRect(x: 0, y: 0, width: width, height: height))
    context.setFillColor(CGColor(gray: 1, alpha: 1))
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    // draw image to context (resizing it)
    context.interpolationQuality = .high
    context.draw(image, in: CGRect(x: 0, y: 0, width: Int(mWidth), height: Int(mHeight)))
    // call .makeImage to turn to image
    return context.makeImage()
  }
}

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    // let start = DispatchTime.now()
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
    let int32Buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt32>.self)
    let int32PerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      if (firstTime && box.initialScreenshot || hasBoxChanged(box: box, buffer: int32Buffer, perRow: int32PerRow)) {
        screenshotBox(box: box, buffer: sampleBuffer, findContent: box.findContent)
        print(">\(box.id)")
      }
    }

    // only true for first loop
    self.firstTime = false

    // release
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
//    let end = DispatchTime.now()
//    let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
//    let timeInterval = Double(nanoTime) / 1_000_000
//    print("frame \(timeInterval) ms")
  }
}
