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
  
  func onCaptured(image: CGImage) {
    print("captured")
  }

  /// TODO: When targeting macOS 10.13, make the `videoCodec` option the type `AVVideoCodecType`
  init(destination: URL, fps: Int, cropRect: CGRect?, showCursor: Bool, highlightClicks: Bool, displayId: CGDirectDisplayID = CGMainDisplayID(), audioDevice: AVCaptureDevice? = .default(for: .audio), videoCodec: String? = nil) throws {
    self.destination = destination
    session = AVCaptureSession()
    
    self.width = CGDisplayPixelsWide(displayId)
    self.height = CGDisplayPixelsHigh(displayId)

    let input = AVCaptureScreenInput(displayID: displayId)
    input.minFrameDuration = CMTimeMake(1, Int32(fps))
    if let cropRect = cropRect {
      input.cropRect = cropRect
    }
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
    let ciImage = CIImage(cvPixelBuffer: imageBuffer)
    guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else { return nil }
    return cgImage
  }
}

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    
    guard let uiImage = imageFromSampleBuffer(sampleBuffer: sampleBuffer) else { return }
    DispatchQueue.main.async { [unowned self] in
      self.onCaptured(image: uiImage)
    }
    
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let int32Buffer = unsafeBitCast(CVPixelBufferGetBaseAddress(pixelBuffer), to: UnsafeMutablePointer<UInt32>.self)
    let int32PerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    
    // Get BGRA value for pixel (43, 17)
    let luma = int32Buffer[17 * int32PerRow + 43]
    
    print("luma is \(luma) in screen \(self.width) by \(self.height)")
    
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
  }
}
