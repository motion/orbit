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
    // reduce contrast
    filter = CIFilter(name: "CIColorControls")!
    filter.setValue(1.5, forKey: "inputContrast")
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

  func writeCharacters(binarizedImage: CGImage, outputImage: CGImage, to outDir: String) {
    let cc = ConnectedComponentsSwiftOCR()
    let result = cc.extractBlobs(NSImage.init(cgImage: binarizedImage, size: NSZeroSize))
    print("found components: \(result.count)")
    if result.count > 0 {
      var pixelString = ""
      for (index, box) in result.enumerated() {
        let image = outputImage.cropping(to: box.1)!
        let image2 = self.resize(image, width: 28, height: 28)!
        // for testing, write out an image
//        self.writeCGImage(image: image2, to: "\(outDir)/\(index).png")
        // for python, write out a data file
        let pixels = pixelValues(fromCGImage: image2).pixelValues!.map(String.init).joined(separator: " ")
        pixelString += "\(pixels)\n"
      }
      do {
        let path = NSURL.fileURL(withPath: "\(outDir)/characters.txt").absoluteURL
        try pixelString.write(to: path, atomically: true, encoding: .utf8)
      } catch {
        print("couldnt write pixel string \(error)")
      }
    }
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

  func cropImage(_ image: CGImage, box: BoundingBox) -> CGImage {
    let x = box.x_start
    let y = box.y_start
    let width = box.getWidth()
    let height = box.getHeight()
    return image.cropping(to: CGRect(x: x, y: y, width: width, height: height))!
  }
  
  func screenshotBox(box: Box, buffer: CMSampleBuffer, findContent: Bool = false) {
    if (box.screenDir != nil) {
      let outPath = "\(box.screenDir ?? "/tmp")/\(box.id).png"
      let cropRect = CGRect(
        x: box.x * 2,
        y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
        width: box.width * 2,
        height: Int(-box.height * 2)
      )
      guard let cgImage = imageFromSampleBuffer(sampleBuffer: buffer, cropRect: cropRect) else {return }
      if (!findContent) {
        self.writeCGImage(image: cgImage, to: outPath)
        return
      }
      var biggestBox: BoundingBox?
      let binarizedImage = filterImageForContentFinding(image: cgImage)
      let cc = ConnectedComponents()
      let result = cc.labelImageFast(image: binarizedImage, calculateBoundingBoxes: true, invert: true)
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
      let cropBox = biggestBox!
      print("! [\(cropBox.x_start), \(cropBox.y_start), \(cropBox.getWidth()), \(cropBox.getHeight())]")
      // if we are writing out
      if (box.screenDir != nil) {
        let ocrWriteImage = self.cropImage(filterImageForOCR(image: cgImage), box: cropBox)
        let ocrCharactersImage = self.cropImage(filterImageForOCRCharacterFinding(image: cgImage), box: cropBox)
        self.writeCharacters(binarizedImage: ocrCharactersImage, outputImage: ocrWriteImage, to: box.screenDir!)
        // for testing write out og image too
        self.writeCGImage(image: ocrWriteImage, to: outPath)
        self.writeCGImage(image: ocrCharactersImage, to: "\(box.screenDir!)/\(box.id)-binarized.png")
      }
    }
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
