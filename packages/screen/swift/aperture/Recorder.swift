import Foundation
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

let filters = Filters()
let images = Images()
let fileManager = FileManager()

func rmAllInside(_ pathUrl: URL) {
  guard let filePaths = try? fileManager.contentsOfDirectory(at: pathUrl, includingPropertiesForKeys: nil, options: []) else { return }
  for filePath in filePaths {
    try? fileManager.removeItem(at: filePath)
  }
}

struct LinePositions {
  var x: Int;
  var y: Int;
  var width: Int;
  var height: Int;
  var description: String {
    return "x \(x), y \(y), width \(width), height \(height)"
  }
}

final class Recorder: NSObject {
  private let input: AVCaptureScreenInput
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var sensitivity: Int
  private var sampleSpacing: Int
  private var firstTime: Bool
  private var shouldDebug: Bool
  private let context = CIContext()
  private var boxes: [String: Box]
  private var lastBoxes: [String: Array<UInt32>]
  private let displayId: CGDirectDisplayID
  private let components = ConnectedComponentsSwiftOCR()
  private var characters: Characters?
  private var ocr: OCRInterface?

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

  init(fps: Int, boxes: Array<Box>, showCursor: Bool, displayId: CGDirectDisplayID = CGMainDisplayID(), videoCodec: String? = nil, sampleSpacing: Int, sensitivity: Int, debug: Bool) throws {
    self.shouldDebug = debug
    self.displayId = displayId
    self.session = AVCaptureSession()
    self.firstTime = true
    self.sampleSpacing = sampleSpacing
    self.sensitivity = sensitivity
    self.lastBoxes = [String: Array<UInt32>]()
    self.boxes = [String: Box]()

    // load python ocr
    print("looking for stuff")
    if let path = Bundle.main.path(forResource: "Bridge", ofType: "plugin") {
      guard let pluginbundle = Bundle(path: path) else { fatalError("Could not load python plugin bundle") }
      pluginbundle.load()
      guard let pc = pluginbundle.principalClass as? OCRInterface.Type else { fatalError("Could not load principal class from python bundle") }
      let interface = pc.createInstance()
      Bridge.setSharedInstance(to: interface)
      self.ocr = Bridge.sharedInstance()
    } else {
      print("no bundle meh")
    }
    
    for box in boxes {
      self.boxes[box.id] = box
    }
    self.input = AVCaptureScreenInput(displayID: displayId)
    output = AVCaptureVideoDataOutput()

    output.videoSettings = [
      kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
    ]
    
    super.init()
    
    self.setFPS(fps: fps)
    self.input.capturesCursor = showCursor
    
    output.alwaysDiscardsLateVideoFrames = true
    let queue = DispatchQueue(label: "com.me.myqueue")
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
  
  func screenshotBox(box: Box, buffer: CMSampleBuffer, bufferPointer: UnsafeMutablePointer<UInt8>, perRow: Int, findContent: Bool = false) {
    let chars = self.characters!
    // clear old files
    rmAllInside(URL(fileURLWithPath: box.screenDir!))
    let startAll = DispatchTime.now()
    if (box.screenDir == nil) {
      print("no screen dir")
      return
    }
    // create filtered images for content find
    let outPath = "\(box.screenDir ?? "/tmp")/\(box.id).png"
    let cgImage = filters.imageFromBuffer(context, sampleBuffer: buffer, cropRect: CGRect(
      x: box.x * 2,
      y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
      width: box.width * 2,
      height: Int(-box.height * 2)
    ))!
    var cgImageBinarized: CGImage? = nil
    if shouldDebug {
      cgImageBinarized = filters.filterImageForOCRCharacterFinding(image: cgImage)
      chars.debugImg = cgImageBinarized
      print("box \(box)")
      print("cgImage size \(cgImage.width) \(cgImage.height)")
    }
    if (!findContent) {
      print("dont find content")
      images.writeCGImage(image: cgImage, to: outPath)
      return
    }
    var start = DispatchTime.now()
    var biggestBox: BoundingBox?
    let boxFindScale = 8
    let binarizedImage = filters.filterImageForContentFinding(image: cgImage, scale: boxFindScale)
    print("1. content find filter: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    let cc = ConnectedComponents()
    let result = cc.labelImageFast(image: binarizedImage, calculateBoundingBoxes: true, invert: true)
    print("1. content CC: \(result.boundingBoxes!.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
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
    if biggestBox == nil {
      images.writeCGImage(image: cgImage, to: outPath)
      return
    }
    // found content
    let bb = biggestBox!
    let innerPad = boxFindScale / 2 // make it a bit smaller to avoid grabbing edge stuff
    // scale to full size
    let frame = [
      bb.x_start * boxFindScale + box.x + innerPad,
      bb.y_start * boxFindScale + box.y + innerPad,
      bb.getWidth() * boxFindScale - innerPad * 2,
      bb.getHeight() * boxFindScale - innerPad * 2
    ]
    
    // adjust frame for character finder
    chars.frameOffset = frame
    
    let cropBox = CGRect(x: frame[0] - box.x, y: frame[1] - box.y, width: frame[2], height: frame[3])
    // send out to world frame offset
    print("! [\(frame[0]), \(frame[1]), \(frame[2]), \(frame[3])]")
    if box.screenDir == nil {
      return
    }
    start = DispatchTime.now()
//    let ocrWriteImage = images.cropImage(filters.filterImageForOCR(image: cgImageLarge), box: cropBoxLarge)
    let ocrCharactersImage = images.cropImage(filters.filterImageForOCRCharacterFinding(image: cgImage), box: cropBox)!
    print("2. filter for ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")

    // find vertical sections
    let lineFindScaling = 4 // scale down denominator
    let vWidth = frame[2] / lineFindScaling
    let vHeight = frame[3] / lineFindScaling
    start = DispatchTime.now()
    let verticalImage = filters.filterForVerticalContentFinding(image: images.resize(ocrCharactersImage, width: vWidth, height: vHeight)!)
    let verticalImageRep = NSBitmapImageRep(cgImage: verticalImage)
    print("3. filter vertical: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    // first loop - find vertical sections
    var verticalSections = Dictionary<Int, Int>() // start => end
    let colHeightMin = 1
    let colStreakMin = 4
    var colStreak = 0
    let colMissMax = 8
    var colMiss = 0
    var colStart = 0
    var imgData = [[Int]]()
    for x in 0..<vWidth {
      imgData.append([Int]())
      var verticalFilled = 0
      for y in 0..<vHeight {
        let filled = verticalImageRep.colorAt(x: x, y: y)!.brightnessComponent == 0.0
        imgData[x].append(filled ? 1 : 0)
        if filled {
          verticalFilled += 1
          if colStart == 0 {
            colStart = x
          }
        }
      }
      let continueStreak = verticalFilled >= colHeightMin
      if continueStreak {
        colStreak += 1
        colMiss = 0
      } else {
        colMiss += 1
        if (colMiss > colMissMax || x == vWidth - 1) && colStreak - colMiss > colStreakMin { // set content block
//          print("found section x \(x) colStreak \(colStreak)")
          verticalSections[colStart] = x - colMiss
          colStreak = 0
          colMiss = 0
          colStart = 0
        } else {
          if verticalSections.count > 0 {
            colStreak += 1
          }
        }
      }
    }
    // none found, just do whole thing
    if verticalSections.count == 0 {
      verticalSections[0] = vWidth - 1
    }
    print("4. find verticals: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms --  \(verticalSections.description)")
    start = DispatchTime.now()
    // second loop - find lines in sections
    var sectionLines = Dictionary<Int, [LinePositions]>()
    var total = 0
    let minLineWidth = 2
    for (start, end) in verticalSections {
      var lines = [LinePositions]()
      var lineStreak = 0
      for y in 0..<vHeight {
        var filled = 0
        var startLine = 0
        var endLine = 0
        for x in start...end {
          if imgData[x][y] == 1 {
            filled += 1
            endLine = x
            if startLine == 0 {
              startLine = x
            }
          }
        }
        let isFilled = filled > minLineWidth
        if !isFilled {
          lineStreak = 0
        } else {
          let x = startLine
          let width = endLine - startLine
          lineStreak += 1
//          print("startLine \(startLine) lineStreak \(lineStreak) y \(y)")
          if lineStreak > 1 {
            // update
            var last = lines[lines.count - 1]
            last.height += 1
            last.width = max(last.width, width)
            last.x = min(last.x, x)
            lines[lines.count - 1] = last
          } else {
            // insert
            lines.append(
              LinePositions(
                x: x,
                y: y,
                width: width,
                height: 1
              )
            )
          }
        }
      }
      sectionLines[start] = lines
      total += lines.count
    }
    print("5. found \(total) lines: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
//    print("sectionLines \(sectionLines.description)")
    start = DispatchTime.now()
    // third loop
    // for each VERTICAL SECTION, get characters
    var allLines = [[Word]]() // store all lines
    for id in sectionLines.keys {
      let scl = lineFindScaling
      let sectionLines: [[Word]] = sectionLines[id]!.pmap(transformer: {(line, index) in
        let padX = 6
        let padY = max(3, min(12, line.height / 10))
        let lineBounds = [
          line.x * scl - padX + frame[0],
          line.y * scl - padY + frame[1],
          // add min in case padX/padY go too far
          min(frame[2], line.width * scl + padX * 2),
          min(frame[3], line.height * scl + padY * 3)
        ]
        // finds characters
        let foundWords: [Word] = chars.find(id: index, bounds: lineBounds)
        // debug line
        if self.shouldDebug {
          images.writeCGImage(
            image: images.cropImage(ocrCharactersImage, box: CGRect(x: lineBounds[0] - frame[0], y: lineBounds[1] - frame[1], width: lineBounds[2], height: lineBounds[3]))!,
            to: "\(box.screenDir!)/linein-\(box.id)-\(id)-\(index).png"
          )
        }
        // write characters
        chars.shouldDebug = self.shouldDebug
        return foundWords
      })
      allLines = allLines + sectionLines
    }

    print("7. found chars: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    
    // print out positions
    for (index, line) in allLines.enumerated() {
      print("line \(index) has \(line.count) words")
      for (wordIndex, word) in line.enumerated() {
        print(" .. \(word.characters.count) length: [\(word.x), \(word.y), \(word.width), \(word.height)]")
      }
    }
    
    // write chars
    var string = ""
    for (index, line) in allLines.enumerated() {
      for (wordIndex, word) in line.enumerated() {
        string += chars.charsToString(word.characters, debugID: shouldDebug ? "\(index)\(wordIndex)" : "")
      }
      string += "\n"
    }
    do {
      let path = NSURL.fileURL(withPath: "/tmp/characters.txt").absoluteURL
      try string.write(to: path, atomically: true, encoding: .utf8)
    } catch {
      print("couldnt write pixel string \(error)")
    }
    print("8. characters.txt: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    
    let foundCharacters = ocr!.ocrCharacters()
    print("predict \(foundCharacters)")
    
    print("")
    print("total \(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000)ms")

    // test write images:
    if self.shouldDebug {
      images.writeCGImage(image: verticalImage, to: "\(box.screenDir!)/\(box.id)-content-find.png")
      images.writeCGImage(image: binarizedImage, to: "\(box.screenDir!)/\(box.id)-binarized.png")
      images.writeCGImage(image: ocrCharactersImage, to: "\(box.screenDir!)/\(box.id)-ocr-characters.png")
      images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png")
    }
  }
  
  func hasBoxChanged(box: Box, buffer: UnsafeMutablePointer<UInt8>, perRow: Int) -> Bool {
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
        curBox.insert(UInt32(luma), at: index)
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
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0)
    let buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt8>.self)
    let perRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
    
    if self.characters == nil {
      characters = Characters(
        data: buffer,
        perRow: perRow,
        maxLuma: 200
      )
      characters!.shouldDebug = shouldDebug
    }
    
    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      characters!.debugDir = box.screenDir!
      if (firstTime && box.initialScreenshot || hasBoxChanged(box: box, buffer: buffer, perRow: perRow)) {
        screenshotBox(box: box, buffer: sampleBuffer, bufferPointer: buffer, perRow: perRow, findContent: box.findContent)
        print(">\(box.id)")
      }
    }
    // only true for first loop
    self.firstTime = false
    // release
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
  }
}
