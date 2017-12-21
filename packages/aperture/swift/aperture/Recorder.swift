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
//    return output.isRecording
  }

  var isPaused: Bool {
    return false
//    return output.isRecordingPaused
  }
  
  func onFrame(image: CGImage) {
    print("captured")
  }

  /// TODO: When targeting macOS 10.13, make the `videoCodec` option the type `AVVideoCodecType`
  init(destination: URL, fps: Int, cropRect: CGRect?, showCursor: Bool, highlightClicks: Bool, displayId: CGDirectDisplayID = CGMainDisplayID(), audioDevice: AVCaptureDevice? = .default(for: .audio), videoCodec: String? = nil) throws {
    self.destination = destination
    session = AVCaptureSession()

    self.lastFrame = []
    self.width = CGDisplayPixelsWide(displayId)
    self.height = CGDisplayPixelsHigh(displayId)
    
    if let cropRect = cropRect {
      let y = CGFloat(self.height * 2 - Int(cropRect.height))
      self.cropRect = CGRect(x: cropRect.minX * 2, y: y, width: cropRect.width, height: cropRect.height)
    } else {
      self.cropRect = CGRect(x: 0, y: 0, width: self.width, height: self.height)
    }

    let input = AVCaptureScreenInput(displayID: displayId)
    input.minFrameDuration = CMTimeMake(1, Int32(fps))
//    if let cropRect = cropRect {
//      input.cropRect = cropRect
//    }
    input.capturesCursor = showCursor
    input.capturesMouseClicks = highlightClicks

    output = AVCaptureVideoDataOutput()
    output.alwaysDiscardsLateVideoFrames = true
    
    super.init()
    
    let queue = DispatchQueue(label: "com.shu223.videosamplequeue")
    output.setSampleBufferDelegate(self, queue: queue)

    if let audioDevice = audioDevice {
      if !audioDevice.hasMediaType(.audio) {
        throw ApertureError.invalidAudioDevice
      }
      let audioInput = try AVCaptureDeviceInput(device: audioDevice)
      if session.canAddInput(audioInput) {
        session.addInput(audioInput)
      } else {
        throw ApertureError.couldNotAddMic
      }
    }

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
  
   func writeCGImage(image: CGImage, to destinationString: String) -> Bool {
      let destinationURL = NSURL.fileURL(withPath: destinationString)
      guard let destination = CGImageDestinationCreateWithURL(destinationURL as CFURL, kUTTypePNG, 1, nil) else { return false }
      CGImageDestinationAddImage(destination, image, nil)
      return CGImageDestinationFinalize(destination)
   }
}

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    let start = DispatchTime.now()
    
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    
//    guard let uiImage = imageFromSampleBuffer(sampleBuffer: sampleBuffer) else { return }
//    writeCGImage(image: uiImage, to: "/tmp/test.png")
    
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let int32Buffer = unsafeBitCast(CVPixelBufferGetBaseAddress(pixelBuffer), to: UnsafeMutablePointer<UInt32>.self)
    let int32PerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
//    let bufferHeight: Int = CVPixelBufferGetHeight(pixelBuffer)
//    let bufferWidth: Int = CVPixelBufferGetWidth(pixelBuffer)
//    let bufferSize = Int(bufferHeight * bufferWidth / 2)
//    let pixels = Array(UnsafeBufferPointer(start: int32Buffer, count: bufferSize))
//    for x in 0..<pixels.count {
//      let r = pixels[x]
//    }
    
    var curFrame: Array<UInt32> = []
    let height = Int(self.cropRect.height)
    let width = Int(self.cropRect.width)
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

    for y in 0..<smallH {
      // iterate col first
      for x in 0..<smallW {
        let realY = y * sampleSpacing
        let realX = x * sampleSpacing
        let index = y * smallH + x
        let luma = int32Buffer[realX * int32PerRow + realY]
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
      }
      if (shouldFinish) {
        break
      }
    }
    
    let hasChanged = shouldFinish
    // let hasChanged = curFrame != self.lastFrame
    
    if (hasChanged) {
      print("changed!")
    }

    self.lastFrame = curFrame
    
    // Get BGRA value for pixel (43, 17)
//    for row in 0...20 {
//      for col in 0...20 {
//        let luma = int32Buffer[row * int32PerRow + col]
//      }
//    }
    
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
    
    let end = DispatchTime.now()
    let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
    let timeInterval = Double(nanoTime) / 1_000_000
//    print("frame \(timeInterval) ms")
  }
}
