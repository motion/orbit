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

// constants
let lineFindScaling = 3 // scale down denominator

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
  private var currentSampleBuffer: CMSampleBuffer?
  private var send: ((String)->Void) = { _ in print("not opened") }
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
  private var ignoreNextScan = false
  private var shouldCancel = false
  private var shouldRunNextTime = false
  private let queue = AsyncGroup()

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
    self.send = { (msg) in ws.send(msg) }
    ws.event.open = {}
    ws.event.close = { code, reason, clean in
      print("close")
    }
    ws.event.error = { error in
      print("error \(error)")
    }
    self.queue.background {
      ws.event.message = { (message) in
        if let text = message as? String {
//          print("msg \(text)")
          if text.count < 5 {
            print("weird text")
            return
          }
          let action = text[0...4]
          if action == "state" {
            // coming from us, ignore
            return
          }
          if action == "resume" {
            self.start()
            self.resume()
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
            self.pause()
            return
          }
          if action == "clear" {
            if self.isScanning {
              self.shouldCancel = true
            }
            if let handle = self.changeHandle {
              handle.cancel()
              self.changeHandle = nil
            }
            return
          }
          print("received unknown message: \(text)")
        }
      }
    }
  }

  func start() {
    if self.shouldCancel {
      self.shouldRunNextTime = true
    }
    if !session.isRunning {
      self.shouldCancel = false
      print("screen: starting...")
      session.startRunning()
      self.send("{ \"state\": { \"isRunning\": true } }")
    }
  }

  func stop() {
    if session.isRunning {
      print("screen: stopping...")
      session.stopRunning()
      self.send("{ \"state\": { \"isRunning\": false } }")
    }
  }
  
  func resume() {
    self.send("{ \"state\": { \"isPaused\": false } }")
  }
  
  func pause() {
    self.send("{ \"state\": { \"isPaused\": true } }")
  }

  func watchBounds(fps: Int, boxes: Array<Box>, showCursor: Bool, videoCodec: String? = nil, sampleSpacing: Int, sensitivity: Int, debug: Bool) {
    if let handle = self.changeHandle {
      handle.cancel()
      self.changeHandle = nil
    }
    self.shouldDebug = debug
    if shouldDebug {
      print("running in debug mode...")
    }
    self.firstTime = true
    self.sampleSpacing = sampleSpacing
    self.sensitivity = sensitivity
    self.lastBoxes = [String: [UInt8]]()
    self.frames = [String: Box]()
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

  func handleCancel() -> Bool {
    let val = self.shouldCancel
    if val { print("canceled") }
    self.shouldCancel = false
    return val
  }

  func getOCR(_ characterLines: [[Word]]) -> [String: String]? {
    var ocrResults = [String: String]() // outline => letter
    let start = DispatchTime.now()
    let chars = self.characters!
    let allCharacters: [Character] = characterLines.flatMap { $0.flatMap { $0.characters } }
    // set filters unique outlines
    let unsolvedCharacters = allCharacters.filter { $0.letter == nil }.unique()
    var foundCharacters = [String]()
    // if necessary, run ocr
    if unsolvedCharacters.count > 0 {
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
      }
      // run ocr
      foundCharacters = ocr!.ocrCharacters()
      if shouldDebug {
        print("9. ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      }
    }
    // collect ocr results
    if foundCharacters.count != unsolvedCharacters.count {
      print("mismatch from in/out to ocr")
      return nil
    }
    for char in unsolvedCharacters {
      ocrResults[char.outline] = foundCharacters.remove(at: 0)
    }
    return ocrResults
  }

  func getCharactersByLine(_ sectionLines: Dictionary<Int, [LinePosition]>, frame: [Int]) -> [[Word]] {
    // third loop
    // for each VERTICAL SECTION, get characters
    var allLines = [[Word]]() // store all lines
    let chars = self.characters!
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
//        if self.shouldDebug {
//          images.writeCGImage(
//            image: images.cropImage(ocrCharactersImage, box: CGRect(x: lineBounds[0] - frame[0], y: lineBounds[1] - frame[1], width: lineBounds[2], height: lineBounds[3]))!,
//            to: "\(box.screenDir!)/linein-\(box.id)-\(id)-\(index).png"
//          )
//        }
        // write characters
        chars.shouldDebug = self.shouldDebug
        return foundWords
      })
      allLines = allLines + sectionLines
    }
    return allLines
  }

  func getVerticalSections(_ box: Box, cgImage: CGImage, frame: [Int], vWidth: Int, vHeight: Int) -> (Dictionary<Int, Int>, [[Int]]) {
    var start = DispatchTime.now()
    // crop
    let cropBox = CGRect(x: frame[0] - box.x, y: frame[1] - box.y, width: frame[2], height: frame[3])
    let ocrCharactersImage = images.cropImage(filters.filterImageForOCRCharacterFinding(image: cgImage), box: cropBox)!
    // find vertical sections
    let verticalImage = filters.filterForVerticalContentFinding(image: images.resize(ocrCharactersImage, width: vWidth, height: vHeight)!)
    let verticalImageRep = NSBitmapImageRep(cgImage: verticalImage)
    // debug
    Async.background { images.writeCGImage(image: verticalImage, to: "\(box.screenDir!)/\(box.id)-section-find.png") }
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
    return (verticalSections, imgData)
  }

  // sections to lines
  func getLines(_ verticalSections: Dictionary<Int, Int>, vWidth: Int, vHeight: Int, imgData: [[Int]]) -> Dictionary<Int, [LinePosition]> {
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
    return sectionLines
  }

  func getContent(_ cgImage: CGImage, box: Box) -> [Int]? {
    var big = CGRect(x: 0, y: 0, width: 0, height: 0)
    let boxFindScale = 6
    let binarizedImage = filters.filterImageForContentFinding(image: cgImage, scale: boxFindScale)
//    if shouldDebug {
      Async.background { images.writeCGImage(image: binarizedImage, to: "\(box.screenDir!)/\(box.id)-binarized.png") }
//    }
    let cc = ConnectedComponentsSwiftOCR()
    let boxes = cc.extractBlobs(binarizedImage, debug: false)
    if boxes.count > 0 {
      for box in boxes {
        if Int(box.minX) == 1 && Int(box.minY) == 1 {
          // skip box that contains entire frame
          continue
        }
        if (Int(box.width) * Int(box.height) > Int(big.width) * Int(big.height)) {
          big = box
        }
      }
    } else {
      print("no biggest box found")
      return nil
    }
    // found content
    let innerPad = boxFindScale / 2 // make it a bit smaller to avoid grabbing edge stuff
    // scale to full size
    let x = Int(big.minX) * boxFindScale + box.x + innerPad
    let y = Int(big.minY) * boxFindScale + box.y + innerPad
    let width = Int(big.width) * boxFindScale - innerPad * 2
    let height = Int(big.height) * boxFindScale - innerPad * 2
    return [ x, y, width, height ]
  }

  // returns the frame it found
  func handleChangedArea(box: Box, sampleBuffer: CMSampleBuffer, perRow: Int, findContent: Bool = false) -> Box? {
    let startAll = DispatchTime.now()
    let chars = self.characters!
    // clear old files
    if shouldDebug {
      rmAllInside(URL(fileURLWithPath: box.screenDir!))
    }
    // create filtered images for content find
    let cgImage = filters.imageFromBuffer(context, sampleBuffer: sampleBuffer, cropRect: CGRect(
      x: box.x * 2,
      y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
      width: box.width * 2,
      height: Int(-box.height * 2)
    ))!
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    // debug
    if shouldDebug {
      chars.debugImg = filters.filterImageForOCRCharacterFinding(image: cgImage)
      Async.background { images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png") }
    }
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    // content find
    var frame = [box.x, box.y, box.width, box.height]
    if findContent {
      if let newFrame = self.getContent(cgImage, box: box) {
        frame = newFrame
      } else {
        print("no content")
        return nil
      }
    }
    chars.frameOffset = frame
    let vWidth = frame[2] / lineFindScaling
    let vHeight = frame[3] / lineFindScaling
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let (verticalSections, imgData) = getVerticalSections(box, cgImage: cgImage, frame: frame, vWidth: vWidth, vHeight: vHeight)
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let sectionLines = getLines(verticalSections, vWidth: vWidth, vHeight: vHeight, imgData: imgData)
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let characterLines = getCharactersByLine(sectionLines, frame: frame)
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    guard let ocrResults = getOCR(characterLines) else { return nil }
    /* check continuation */ queue.wait(); if handleCancel() { return nil }

    // get all answers
    var words = [String]()
    var lines = [String]()
    for (lineIndex, line) in characterLines.enumerated() {
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

    print("got ocr")

    // update character cache
    Async.utility(after: 0.04) {
      chars.updateCache(ocrResults)
    }

    /* check continuation */ queue.wait(); if handleCancel() { return nil }

    // send to world
    self.send("{ \"action\": \"words\", \"value\": [\(words.joined(separator: ","))] }")
    self.send("{ \"action\": \"lines\", \"value\": [\(lines.joined(separator: ","))] }")

    // test write images:
    if self.shouldDebug {
      images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png")
    }

    // return new box with content adjusted frame
    print("finish scan in \(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000)ms")
    return Box(
      id: box.id,
      x: frame[0],
      y: frame[1],
      width: frame[2],
      height: frame[3],
      screenDir: box.screenDir,
      findContent: false, // now false on finding new content
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
  private func getBufferFrame(_ sampleBuffer: CMSampleBuffer) -> (UnsafeMutablePointer<UInt8>, Int, () -> Void) {
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0)
    let buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt8>.self)
    let perRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
    let release: () -> Void = {
      CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
    }
    return (buffer, perRow, release)
  }

  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    // keep this always in sync
    self.currentSampleBuffer = sampleBuffer
    // todo: use this per-box
    if self.isScanning {
      return
    }
    if self.boxes.count == 0 {
      return
    }
    // get frame
    let (buffer, perRow, release) = self.getBufferFrame(sampleBuffer)
    // one time setup
    if self.characters == nil {
      characters = Characters(
        buffer: buffer,
        perRow: perRow,
        isBlackIfUnder: 180
      )
      characters!.shouldDebug = shouldDebug
    } else {
      self.characters!.buffer = buffer
    }
//    let fpsInSeconds = 60 / 60 / self.fps // gives you fps => x  (60 => 0.16) and (2 => 0.5)
    // debounce while scrolling amt in seconds:
    let delayHandleChange = 0.3
    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.frames[boxId] ?? self.boxes[boxId]!
      if shouldDebug { characters!.debugDir = box.screenDir! }
      let changedBox = hasBoxChanged(box: box, buffer: buffer, perRow: perRow)
      if (firstTime && box.initialScreenshot || changedBox) {
        // options to ignore next or to force next
        if ignoreNextScan && !shouldRunNextTime {
          self.ignoreNextScan = false
          print("ignored this scan")
          return
        }
        if shouldRunNextTime {
          self.shouldRunNextTime = false
        }
        print("changed! \(box.id)")
        self.send("{ \"action\": \"clearWord\", \"value\": \"\(box.id)\" }")
        // debounce
        if (self.changeHandle != nil) {
          print("canceling last")
          self.changeHandle!.cancel()
          self.changeHandle = nil
          self.isScanning = false
          self.ignoreNextScan = false
          self.shouldCancel = false
        }
        // wait for 2 frames of clear
        // small delay by default to not pick up old highlights that havent cleared yet
        self.changeHandle = Async.userInteractive(after: changedBox ? delayHandleChange : 0.02) { // debounce (seconds)
          self.isScanning = true

          // update characters buffer
          let (buffer, _, release) = self.getBufferFrame(sampleBuffer)
          self.characters!.buffer = buffer

          // handle change
          if let frame = self.handleChangedArea(
            box: box,
            sampleBuffer: self.currentSampleBuffer!,
            perRow: perRow,
            findContent: box.findContent
          ) {
            self.frames[boxId] = frame
          }

          release()

          // after x seconds, re-enable watching
          // this is because screen needs time to update highlight boxes
          Async.main(after: 0.05) {
            print("re-enable scan after last")
            self.shouldCancel = false
            self.isScanning = false
            self.ignoreNextScan = true
          }
        }
      }
    }
    // only true for first loop
    self.firstTime = false
    // release
    release()
  }
}
