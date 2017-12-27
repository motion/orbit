import AVFoundation

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
}

final class Recorder: NSObject {
  private let input: AVCaptureScreenInput
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var sensitivity: Int
  private var sampleSpacing: Int
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
  
  private func imageFromSampleBuffer(sampleBuffer: CMSampleBuffer, cropRect: CGRect) -> CGImage? {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return nil }
    var ciImage = CIImage(cvPixelBuffer: imageBuffer)
    ciImage = ciImage.cropped(to: cropRect)
    guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else { return nil }
    return cgImage
  }
  
  func scaleImage(cgImage: CGImage, divide: Int) -> CGImage {
    let ccc = CIImage(cgImage: cgImage)
    let filter = CIFilter(name: "CILanczosScaleTransform")!
    filter.setValue(ccc, forKey: "inputImage")
    filter.setValue(0.5, forKey: "inputScale")
    filter.setValue(1.0, forKey: "inputAspectRatio")
    let outputImage = filter.value(forKey: "outputImage") as! CIImage
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
    // alt method, blurrier but bolder
    // todo, test which performs better (speed vs translation)
//    let width = cgImage.width / divide
//    let height = cgImage.height / divide
//    let cgRect = CGRect(origin: CGPoint.zero, size: CGSize(width: CGFloat(width), height: CGFloat(height)))
//    let context = CGContext(
//      data: nil,
//      width: width,
//      height: height,
//      bitsPerComponent: cgImage.bitsPerComponent,
//      bytesPerRow: cgImage.bytesPerRow,
//      space: cgImage.colorSpace!,
//      bitmapInfo: cgImage.bitmapInfo.rawValue
//    )!
//    context.interpolationQuality = CGInterpolationQuality.high
//    context.draw(cgImage, in: cgRect)
//    return context.makeImage()!
  }
  
  func writeCGImage(image: CGImage, to destination: String) -> Bool {
    let cgImage = scaleImage(cgImage: image, divide: 2)
    let destinationURL = URL(fileURLWithPath: destination)
    guard let finalDestination = CGImageDestinationCreateWithURL(destinationURL as CFURL, kUTTypePNG, 1, nil) else { return false }
    let resolution = 70
    let properties: NSDictionary = [
      kCGImageDestinationLossyCompressionQuality: 1,
      kCGImagePropertyDPIHeight: resolution,
      kCGImagePropertyDPIWidth: resolution
    ]
    CGImageDestinationAddImage(finalDestination, cgImage, properties)
    return CGImageDestinationFinalize(finalDestination)
  }
  
  func screenshotBox(box: Box, buffer: CMSampleBuffer) {
    if (box.screenDir != nil) {
      let cropRect = CGRect(
        x: box.x * 2,
        y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
        width: box.width * 2,
        height: Int(-box.height * 2)
      )
      guard let uiImage = imageFromSampleBuffer(sampleBuffer: buffer, cropRect: cropRect) else { return }
      let outPath = "\(box.screenDir ?? "/tmp/screen-")/\(box.id).png"
      print("write to path \(outPath)")
      if (self.writeCGImage(image: uiImage, to: outPath)) {
        // good
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
}

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
//    let start = DispatchTime.now()
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
    let int32Buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt32>.self)
    let int32PerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      if (hasBoxChanged(box: box, buffer: int32Buffer, perRow: int32PerRow)) {
        screenshotBox(box: box, buffer: sampleBuffer)
        print("\(box.id)")
      }
    }
    // release
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
//    let end = DispatchTime.now()
//    let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
//    let timeInterval = Double(nanoTime) / 1_000_000
//    print("frame \(timeInterval) ms")
  }
}
