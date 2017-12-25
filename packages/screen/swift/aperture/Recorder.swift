import AVFoundation

enum ApertureError: Error {
  case invalidAudioDevice
  case couldNotAddScreen
  case couldNotAddMic
  case couldNotAddOutput
}

struct Box: Decodable {
  let id: Int
  let x: Int
  let y: Int
  let width: Int
  let height: Int
}

final class Recorder: NSObject {
  private let input: AVCaptureScreenInput
  private var destination: URL
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var sensitivity: Int
  private var sampleSpacing: Int
  private let context = CIContext()
  private var boxes: [Int: Box]
  private var lastBoxes: [Int: Array<Int>]
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

  init(destination: URL, fps: Int, boxes: Array<Box>, showCursor: Bool, displayId: CGDirectDisplayID = CGMainDisplayID(), videoCodec: String? = nil, sampleSpacing: Int, sensitivity: Int) throws {
    self.destination = destination
    self.displayId = displayId
    self.session = AVCaptureSession()
    self.sampleSpacing = sampleSpacing
    self.sensitivity = sensitivity
    self.lastBoxes = [Int: Array<Int>]()
    self.boxes = [Int: Box]()
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
  
  func hasBoxChanged(box: Box, buffer: UnsafeMutablePointer<UInt32>, perRow: Int) -> Bool {
    let lastBox = self.lastBoxes[box.id]
    var hasLastBox = false
    let boxX = box.x
    let boxY = box.y
    let height = Int(box.height) / 2
    let width = Int(box.width) / 2
    var curFrame: Array<UInt32> = []
    var numChanged = 0
    var shouldFinish = false
    
    // sensitivity = how many pixels need to change before it triggers
    //    you want this lower because allows loop to break sooner
    let sensitivity = self.sensitivity
    // sampleSpacing = dithering basically, how many pixels to skip before checking the next
    //    you want this higher, because it makes the loops shorter
    let sampleSpacing = self.sampleSpacing
    let smallH = height/sampleSpacing
    let smallW = width/sampleSpacing
    if (lastBox != nil) {
      hasLastBox = lastBox?.count == smallW * smallH
    }
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
        curFrame.insert(luma, at: index)
//        lastIndex = index
      }
      if (shouldFinish) {
        break
      }
    }

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

    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      
      // test write box
      let cropRect = CGRect(
        x: box.x * 2,
        y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
        width: box.width * 2,
        height: Int(-box.height * 2)
      )
      guard let uiImage = imageFromSampleBuffer(sampleBuffer: sampleBuffer, cropRect: cropRect) else { return }
      if (self.writeCGImage(image: uiImage, to: self.destination)) { }
      
      if (hasBoxChanged(box: box, buffer: int32Buffer, perRow: int32PerRow)) {
        print("\(box.id)")
      }
    }

    // todo: store each box diff
//    self.lastFrame = curFrame
    
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
    
//    let end = DispatchTime.now()
//    let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
//    let timeInterval = Double(nanoTime) / 1_000_000
//    print("frame \(timeInterval) ms")
  }
}
