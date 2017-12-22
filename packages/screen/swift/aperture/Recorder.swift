import AVFoundation

enum ApertureError: Error {
  case invalidAudioDevice
  case couldNotAddScreen
  case couldNotAddMic
  case couldNotAddOutput
}

final class Recorder: NSObject {
  private var destination: URL
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var width: Int
  private var height: Int
  private var offsetY: Int
  private var offsetX: Int
  private let context = CIContext()
  private var cropRect: CGRect
  
  var lastFrame: Array<UInt32>

  var onStart: (() -> Void)?
  var onFinish: (() -> Void)?
  var onError: ((Error) -> Void)?
  var onPause: (() -> Void)?
  var onResume: (() -> Void)?

  var isRecording: Bool {
    return false
  }

  var isPaused: Bool {
    return false
  }
  
  func onFrame(image: CGImage) {
    print("captured")
  }

  init(destination: URL, fps: Int, cropRect: CGRect?, showCursor: Bool, displayId: CGDirectDisplayID = CGMainDisplayID(), videoCodec: String? = nil) throws {
    self.destination = destination
    session = AVCaptureSession()

    self.lastFrame = []
    self.width = CGDisplayPixelsWide(displayId)
    self.height = CGDisplayPixelsHigh(displayId)
    self.offsetX = 0
    self.offsetY = 0
    
    if let cropRect = cropRect {
      self.offsetX = Int(cropRect.minX)
      self.offsetY = Int(cropRect.minY)
      let y = CGFloat(self.height * 2 - Int(cropRect.minY * 2))
      self.cropRect = CGRect(x: cropRect.minX * 2, y: y, width: cropRect.width * 2, height: CGFloat(-cropRect.height * 2))
    } else {
      self.cropRect = CGRect(x: 0, y: 0, width: self.width, height: self.height)
    }

    let input = AVCaptureScreenInput(displayID: displayId)
    input.minFrameDuration = CMTimeMake(1, Int32(fps))
    input.capturesCursor = showCursor

    output = AVCaptureVideoDataOutput()
    output.alwaysDiscardsLateVideoFrames = true
    
    super.init()
    
    let queue = DispatchQueue(label: "com.shu223.videosamplequeue")
    output.setSampleBufferDelegate(self, queue: queue)

    if session.canAddInput(input) {
      session.addInput(input)
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

  func pause() {
  }

  func resume() {
  }
  
  private func imageFromSampleBuffer(sampleBuffer: CMSampleBuffer) -> CGImage? {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return nil }
    var ciImage = CIImage(cvPixelBuffer: imageBuffer)
    ciImage = ciImage.cropped(to: self.cropRect)
    guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else { return nil }
    return cgImage
  }
  
  func scaleImage(cgImage: CGImage, divide: Int) -> CGImage {
    let width = cgImage.width / divide
    let height = cgImage.height / divide
    let bitsPerComponent = cgImage.bitsPerComponent
    let bytesPerRow = cgImage.bytesPerRow
    let colorSpace = cgImage.colorSpace
    let bitmapInfo = cgImage.bitmapInfo
    let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: bitsPerComponent, bytesPerRow: bytesPerRow, space: colorSpace!, bitmapInfo: bitmapInfo.rawValue)
    context?.draw(cgImage, in: CGRect(origin: CGPoint.zero, size: CGSize(width: CGFloat(width), height: CGFloat(height))))
    return context!.makeImage()!
  }
  
   func writeCGImage(image: CGImage, to destination: URL) -> Bool {
      let cgImage = scaleImage(cgImage: image, divide: 2)
      guard let destination = CGImageDestinationCreateWithURL(destination as CFURL, kUTTypePNG, 1, nil) else { return false }
      let resolution = 70
      let properties: NSDictionary = [
        kCGImageDestinationLossyCompressionQuality: 1,
        kCGImagePropertyDPIHeight: resolution,
        kCGImagePropertyDPIWidth: resolution
      ]
      CGImageDestinationAddImage(destination, cgImage, properties)
      return CGImageDestinationFinalize(destination)
   }
}

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    let start = DispatchTime.now()

    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
    let int32Buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt32>.self)
    let int32PerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)

    var curFrame: Array<UInt32> = []
    let height = Int(self.cropRect.height) / 2
    let width = Int(self.cropRect.width) / 2
    var numChanged = 0
    var shouldFinish = false
    
    // sensitivity = how many pixels need to change before it triggers
    //    you want this lower because allows loop to break sooner
    let sensitivity = 1
    // sampleSpacing = dithering basically, how many pixels to skip before checking the next
    //    you want this higher, because it makes the loops shorter
    let sampleSpacing = 10
    let smallH = height/sampleSpacing
    let smallW = width/sampleSpacing
    let hasLastFrame = self.lastFrame.count == smallW * smallH
    var lastIndex = 0

    // on first run write out an image to test
//    if (!hasLastFrame) {
//      guard let uiImage = imageFromSampleBuffer(sampleBuffer: sampleBuffer) else { return }
//      let destinationURL = URL.init(fileURLWithPath: "/tmp/test.png")
//      writeCGImage(image: uiImage, to: destinationURL)
//    }

    for y in 0..<smallH {
      // iterate col first
      for x in 0..<smallW {
        let realY = y * sampleSpacing / 2 + self.offsetY / 2
        let realX = x * sampleSpacing + self.offsetX / 2
        let index = y * smallW + x
        let luma = int32Buffer[realY * int32PerRow + realX]
        if (hasLastFrame) {
          if (self.lastFrame[index] != luma) {
            numChanged = numChanged + 1
            if (numChanged > sensitivity) {
              shouldFinish = true
              break
            }
          }
        }
        curFrame.insert(luma, at: index)
        lastIndex = index
      }
      if (shouldFinish) {
        break
      }
    }
    
    let hasChanged = shouldFinish
    // let hasChanged = curFrame != self.lastFrame
    
    if (hasChanged) {
      print("changed!")
      guard let uiImage = imageFromSampleBuffer(sampleBuffer: sampleBuffer) else { return }
      if (self.writeCGImage(image: uiImage, to: self.destination)) {
      }
    }

    self.lastFrame = curFrame
    
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
    
//    let end = DispatchTime.now()
//    let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
//    let timeInterval = Double(nanoTime) / 1_000_000
//    print("frame \(timeInterval) ms")
  }
}
