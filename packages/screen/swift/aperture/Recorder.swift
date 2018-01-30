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

struct LinePosition {
  var x: Int
  var y: Int
  var width: Int
  var height: Int
  var topFillAmt: Int
  var bottomFillAmt: Int
  var description: String {
    return "x \(x), y \(y), width \(width), height \(height)"
  }
}

final class Recorder: NSObject {
  private var send: ((String)->Bool)?
  private let input: AVCaptureScreenInput
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var sensitivity: Int
  private var sampleSpacing: Int
  private var firstTime: Bool
  private var shouldDebug: Bool
  private let context = CIContext()
  private var boxes: [String: Box]
  private var frames: [String: Box]
  private var lastBoxes: [String: [UInt8]]
  private var displayId: CGDirectDisplayID
  private let components = ConnectedComponentsSwiftOCR()
  private var characters: Characters?
  private var ocr: OCRInterface?
  private var changeHandle: AsyncBlock<Void, ()>?
  private var isScanning = false
  private var fps = 0

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

  init(displayId: CGDirectDisplayID = CGMainDisplayID()) throws {
    // load python ocr
    if let path = Bundle.main.path(forResource: "Bridge", ofType: "plugin") {
      guard let pluginbundle = Bundle(path: path) else { fatalError("Could not load python plugin bundle") }
      pluginbundle.load()
      guard let pc = pluginbundle.principalClass as? OCRInterface.Type else { fatalError("Could not load principal class from python bundle") }
      let interface = pc.createInstance()
      Bridge.setSharedInstance(to: interface)
      self.ocr = Bridge.sharedInstance()
    } else {
      print("no bundle meh")
      exit(0)
    }

    // start video
    self.displayId = displayId
    self.session = AVCaptureSession()
    self.input = AVCaptureScreenInput(displayID: displayId)
    output = AVCaptureVideoDataOutput()

    output.videoSettings = [
      kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
    ]

    self.shouldDebug = false
    self.firstTime = true
    self.sampleSpacing = 0
    self.sensitivity = 1
    self.boxes = [String: Box]()
    self.lastBoxes = [String: [UInt8]]()
    self.frames = [String: Box]()

    super.init()

    // setup recorder
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

    // socket bridge
    let ws = WebSocket("ws://localhost:40512")
    self.send = { (msg) in
      ws.send(msg)
      return true
    }
    ws.event.open = {}
    ws.event.close = { code, reason, clean in
      print("close")
    }
    ws.event.error = { error in
      print("error \(error)")
    }
    ws.event.message = { (message) in
      if let text = message as? String {
        if text.count < 5 {
          print("weird text")
          return
        }
        let action = text[0...4]
        if action == "state" {
          // coming from us, ignore
          return
        }
        if action == "start" {
          self.start()
          return
        }
        if action == "watch" {
          do {
            let options = try JSONDecoder().decode(Options.self, from: text[5..<text.count].data(using: .utf8)!)
            self.watchBounds(
              fps: options.fps,
              boxes: options.boxes,
              showCursor: options.showCursor,
              videoCodec: options.videoCodec,
              sampleSpacing: options.sampleSpacing,
              sensitivity: options.sensitivity,
              debug: options.debug
            )
          } catch {
            print("Error parsing arguments \(text)")
          }
          return
        }
        if action == "pause" {
          self.stop()
          return
        }
        print("received unknown message: \(text)")
      }
    }
  }

  func start() {
    print("screen: starting...")
    session.startRunning()
    _ = self.send!("{ \"state\": { \"isRunning\": true } }")
  }

  func stop() {
    print("screen: stopping...")
    session.stopRunning()
    _ = self.send!("{ \"state\": { \"isRunning\": false } }")
  }

  func watchBounds(fps: Int, boxes: Array<Box>, showCursor: Bool, videoCodec: String? = nil, sampleSpacing: Int, sensitivity: Int, debug: Bool) {
    self.shouldDebug = debug
    if shouldDebug {
      print("running in debug mode...")
    }
    self.firstTime = true
    self.sampleSpacing = sampleSpacing
    self.sensitivity = sensitivity
    self.lastBoxes = [String: [UInt8]]()
    self.boxes = [String: Box]()
    for box in boxes {
      self.boxes[box.id] = box
    }
    self.setFPS(fps: fps)
    self.input.capturesCursor = showCursor
  }

  func setFPS(fps: Int) {
    self.fps = fps
    self.input.minFrameDuration = CMTimeMake(1, Int32(fps))
  }

  // returns the frame it found
  func handleChangedArea(box: Box, buffer: CMSampleBuffer, bufferPointer: UnsafeMutablePointer<UInt8>, perRow: Int, findContent: Bool = false) -> Box? {
    self.isScanning = true
    let chars = self.characters!
    // clear old files
    rmAllInside(URL(fileURLWithPath: box.screenDir!))
    let startAll = DispatchTime.now()
    if (box.screenDir == nil) {
      print("no screen dir")
      return nil
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
      return nil
    }
    var start = DispatchTime.now()
    var biggestBox: BoundingBox?
    let boxFindScale = 8
    let binarizedImage = filters.filterImageForContentFinding(image: cgImage, scale: boxFindScale)

    if shouldDebug {
      print("1. content find filter: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      start = DispatchTime.now()
    }

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
    if biggestBox == nil {
      images.writeCGImage(image: cgImage, to: outPath)
      return nil
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
    if box.screenDir == nil {
      return nil
    }
    start = DispatchTime.now()
    // crop
    let cropBox = CGRect(x: frame[0] - box.x, y: frame[1] - box.y, width: frame[2], height: frame[3])
    let ocrCharactersImage = images.cropImage(filters.filterImageForOCRCharacterFinding(image: cgImage), box: cropBox)!

    if shouldDebug {
      print("2. filter for ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      start = DispatchTime.now()
    }

    // find vertical sections
    let lineFindScaling = 3 // scale down denominator
    let vWidth = frame[2] / lineFindScaling
    let vHeight = frame[3] / lineFindScaling
    let verticalImage = filters.filterForVerticalContentFinding(image: images.resize(ocrCharactersImage, width: vWidth, height: vHeight)!)
    let verticalImageRep = NSBitmapImageRep(cgImage: verticalImage)

    if shouldDebug {
      print("3. filter vertical: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      start = DispatchTime.now()
    }

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

    if shouldDebug {
      print("4. find verticals: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms --  \(verticalSections.description)")
      start = DispatchTime.now()
    }

    // second loop - find lines in sections
    var sectionLines = Dictionary<Int, [LinePosition]>()
    var total = 0
    let minLineWidth = 1
    for (start, end) in verticalSections {
      var lines = [LinePosition]()
      var lineStreak = 0
      for y in 0..<vHeight {
        var lineFilledPx = 0
        var startLine = 0
        var endLine = 0
        for x in start...end {
          if imgData[x][y] == 1 {
            lineFilledPx += 1
            endLine = x
            if startLine == 0 {
              startLine = x
            }
          }
        }
        let isFilled = lineFilledPx > minLineWidth
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
            last.bottomFillAmt = lineFilledPx
            last.x = min(last.x, x)
            lines[lines.count - 1] = last
          } else {
            // insert
            lines.append(
              LinePosition(
                x: x,
                y: y,
                width: width,
                height: 1,
                topFillAmt: lineFilledPx,
                bottomFillAmt: lineFilledPx
              )
            )
          }
        }
      }
      sectionLines[start] = lines
      total += lines.count
    }

    // third loop
    // for each VERTICAL SECTION, get characters
    var allLines = [[Word]]() // store all lines
    for id in sectionLines.keys {
      let scl = lineFindScaling
      let sectionLines: [[Word]] = sectionLines[id]!.pmap(transformer: {(line, index) in
        let padX = 6
        let padY = max(3, min(12, line.height / 10))
//        let shiftUp = line.topFillAmt * 10 / line.bottomFillAmt * 10
//        print("shiftUp \(shiftUp)")
        let lineBounds = [
          line.x * scl - padX + frame[0],
          line.y * scl - padY + frame[1],
          // add min in case padX/padY go too far
          min(frame[2], line.width * scl + padX * 3),
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

    // check for unsolved outlines
    let allCharacters: [Character] = allLines.flatMap { $0.flatMap { $0.characters } }

    if shouldDebug {
      print("7. gather characters \(allCharacters.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    }

    // set filters unique outlines
    let unsolvedCharacters = allCharacters.filter { $0.letter == nil }.unique()
    var foundCharacters = [String]()

    // if necessary, run ocr
    if unsolvedCharacters.count > 0 {
      start = DispatchTime.now()
      // write ocr string
      if shouldDebug {
        print("found \(unsolvedCharacters.count) uniq out of \(allCharacters.count) total")
      }
      let ocrString = unsolvedCharacters.enumerated().map({ item in
        return chars.charToString(item.element, debugID: "")
      }).joined(separator: "\n")
      do {
        let path = NSURL.fileURL(withPath: "/tmp/characters.txt").absoluteURL
        try ocrString.write(to: path, atomically: true, encoding: .utf8)
      } catch {
        print("couldnt write pixel string \(error)")
      }

      if shouldDebug {
        print("8. characters.txt: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
        start = DispatchTime.now()
      }

      // run ocr
      foundCharacters = ocr!.ocrCharacters()

      if shouldDebug {
        print("9. ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      }
    }

    // collect ocr results
    var ocrResults = [String: String]() // outline => letter
    if foundCharacters.count != unsolvedCharacters.count {
      print("mismatch from in/out to ocr")
      return nil
    }
    for char in unsolvedCharacters {
      ocrResults[char.outline] = foundCharacters.remove(at: 0)
    }

    start = DispatchTime.now()

    // get all answers
    var words = [String]()
    var lines = [String]()
    for (lineIndex, line) in allLines.enumerated() {
      if line.count == 0 {
        continue
      }
      var minY = 10000
      var maxH = 0
      for (wordIndex, word) in line.enumerated() {
        let characters: [String] = word.characters.map({(char) in
          // calculate line position
          if char.y < minY { minY = char.y }
          if char.height > maxH { maxH = char.height }
          // retrieve letter
          // was returned from characters cache:
          if char.letter != nil {
            return char.letter!
          }
          // was returned from the ocr:
          if let answer = ocrResults[char.outline] {
            return answer
          }
          return ""
        })
        // debug: print out all characters
        if shouldDebug {
          for (index, char) in word.characters.enumerated() {
            _ = chars.charToString(char, debugID: "\(lineIndex)-\(wordIndex)-\(index)-\(characters[index])")
          }
        }
        let wordStr = characters.joined()
        words.append("[\(word.x),\(word.y),\(word.width),\(word.height),\"\(wordStr)\"]")
      }
      let firstWord = line.first!
      var width: Int
      if line.count > 1 {
        let lastWord = line.last!
        width = lastWord.x + lastWord.width - firstWord.x
      } else {
        width = firstWord.x + firstWord.width
      }
      lines.append("[\(firstWord.x),\(minY),\(width),\(maxH)]")
    }

    // update character cache
    Async.background {
      chars.updateCache(ocrResults)
    }

    // send to world
    _ = self.send!("{ \"action\": \"words\", \"value\": [\(words.joined(separator: ","))] }")
    _ = self.send!("{ \"action\": \"lines\", \"value\": [\(lines.joined(separator: ","))] }")

    // after x seconds, re-enable watching
    // this is because screen needs time to update highlight boxes
    Async.background(after: 0.5) {
      print("re-enable scan after last")
      self.isScanning = false
    }

    if shouldDebug {
      print("10. answer string: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      start = DispatchTime.now()
      print("")
    }

    print("finish scan in \(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000)ms")

    // test write images:
    if self.shouldDebug {
      images.writeCGImage(image: verticalImage, to: "\(box.screenDir!)/\(box.id)-content-find.png")
      images.writeCGImage(image: binarizedImage, to: "\(box.screenDir!)/\(box.id)-binarized.png")
      images.writeCGImage(image: ocrCharactersImage, to: "\(box.screenDir!)/\(box.id)-ocr-characters.png")
      images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png")
    }
    
    // return new box with content adjusted frame
    return Box(
      id: box.id,
      x: frame[0],
      y: frame[1],
      width: frame[2],
      height: frame[3],
      screenDir: box.screenDir,
      findContent: box.findContent,
      initialScreenshot: box.initialScreenshot
    )
  }

  func hasBoxChanged(box: Box, buffer: UnsafeMutablePointer<UInt8>, perRow: Int) -> Bool {
    let lastBox = self.lastBoxes[box.id]
    var hasLastBox = false
    let boxX = box.x
    let boxY = box.y
    let height = Int(box.height) / 2
    let width = Int(box.width) / 2
    var curBox: [UInt8] = []
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
    // todo: use this per-box
    if self.isScanning {
      return
    }
    if self.boxes.count == 0 {
      return
    }

    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0)
    let buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt8>.self)
    let perRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)

    // one time setup
    if self.characters == nil {
      characters = Characters(
        data: buffer,
        perRow: perRow,
        isBlackIfUnder: 180
      )
      characters!.shouldDebug = shouldDebug
    }

    let fpsInSeconds = 60 / 60 / self.fps // gives you fps => x  (60 => 0.16) and (2 => 0.5)
    let delayHandleChange = Double(fpsInSeconds * 2)

    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.frames[boxId] ?? self.boxes[boxId]!
      if shouldDebug { characters!.debugDir = box.screenDir! }
      let changedBox = hasBoxChanged(box: box, buffer: buffer, perRow: perRow)
      if (firstTime && box.initialScreenshot || changedBox) {
        if self.send!("{ \"action\": \"clearWord\", \"value\": \"\(box.id)\" }") { }
        // debounce
        if (self.changeHandle != nil) {
          print("canceling last")
          self.changeHandle!.cancel()
          self.changeHandle = nil
        }
        // wait for 2 frames of clear
        self.changeHandle = Async.main(after: changedBox ? delayHandleChange : 0) { // debounce (seconds)
          print("start scanning for ocr")
          // get new frame now
          let pixelBuffer2: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
          CVPixelBufferLockBaseAddress(pixelBuffer2, CVPixelBufferLockFlags(rawValue: 0));
          let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer2, 0)
          let buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt8>.self)
          let perRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer2, 0)

          // handle new frame
          if let frame = self.handleChangedArea(box: box, buffer: sampleBuffer, bufferPointer: buffer, perRow: perRow, findContent: box.findContent) {
            self.frames[boxId] = frame
          }

          CVPixelBufferUnlockBaseAddress(pixelBuffer2, CVPixelBufferLockFlags(rawValue: 0))
        }
      }
    }
    // only true for first loop
    self.firstTime = false
    // release
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
  }
}
