import Foundation
import AVFoundation
import AppKit

let shouldDebugTiming = true
let simpleDebugImages = false

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
  let screenDir: String?
  let findContent: Bool
  let initialScreenshot: Bool
}

// constants
let lineFindScaling = 5 // scale down denominator

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
  var isCleared = [Int: Bool]()
  var currentSampleBuffer: CMSampleBuffer?
  var send: ((String)->Void) = { _ in print("not opened") }
  let input: AVCaptureScreenInput
  var session: AVCaptureSession
  var output: AVCaptureVideoDataOutput
  var sensitivity: Int
  var sampleSpacing: Int
  var firstTime: Bool
  var shouldDebug: Bool
  let context = CIContext()
  var boxes: [Int: Box]
  var lastBoxes: [Int: [UInt8]]
  var originalBoxes: [Int: [UInt8]]
  var displayId: CGDirectDisplayID
  let components = ConnectedComponentsSwiftOCR()
  var characters: Characters?
  var ocr: OCRInterface?
  var changeHandle: AsyncBlock<Void, ()>?
  var isScanning = false
  var fps = 0
  var ignoreNextScan = false
  var shouldCancel = false
  var shouldRunNextTime = false
  let queue = AsyncGroup()
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
    
    print("output types: \(output.availableVideoCodecTypes) \(output.availableVideoPixelFormatTypes)")

    output.videoSettings = [
      kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
    ]

    self.shouldDebug = false
    self.firstTime = true
    self.sampleSpacing = 0
    self.sensitivity = 1
    self.boxes = [Int: Box]()
    self.lastBoxes = [Int: [UInt8]]()
    self.originalBoxes = [Int: [UInt8]]()

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
//      print(msg)
      ws.send(msg)
    }
    ws.event.open = {
//      print("screen.ws.opened")
    }
    ws.event.close = { code, reason, clean in
//      print("screen.ws.close")
    }
    ws.event.error = { error in
      print("screen.ws.error \(error)")
    }
    self.queue.background {
      ws.event.message = { (message) in
        if let text = message as? String {
          print("msg \(text)")
          if text.count < 5 {
            print("weird text")
            return
          }
          let action = text[0...4]
          if action == "state" {
            // coming from us, ignore
            return
          }
          if action == "pause" {
            self.pause()
            return
          }
          if action == "resum" {
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
    debug("screen.start()")
    if self.shouldCancel {
      self.shouldRunNextTime = true
    }
    if !session.isRunning {
      self.shouldCancel = false
      session.startRunning()
      self.send("{ \"state\": { \"isRunning\": true, \"isPaused\": false } }")
    }
  }

  func stop() {
    if session.isRunning {
      session.stopRunning()
      self.send("{ \"state\": { \"isRunning\": false } }")
    }
  }

  func resume() {
    print("screen: resuming...")
    self.start()
    self.send("{ \"state\": { \"isPaused\": false } }")
  }

  func pause() {
    print("screen: pausing...")
    self.stop()
    self.send("{ \"state\": { \"isPaused\": true } }")
  }
  
  func debug(_ str: String) {
    if shouldDebugTiming {
      if curTime != nil {
        let timeEnd = Int(Double(DispatchTime.now().uptimeNanoseconds - curTime!.uptimeNanoseconds) / 1_000_000)
        print("\(str.padding(toLength: 36, withPad: " ", startingAt: 0)) \(timeEnd)ms")
        curTime = DispatchTime.now()
      } else {
        print(str)
      }
    }
  }

  private var curTime: DispatchTime?
  func startTime() {
    curTime = DispatchTime.now()
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
    print("reset first time to true")
    self.firstTime = true
    self.sampleSpacing = sampleSpacing
    self.sensitivity = sensitivity
    self.isCleared = [Int: Bool]()
    self.lastBoxes = [Int: [UInt8]]()
    self.originalBoxes = [Int: [UInt8]]()
    self.boxes = [Int: Box]()
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
    startTime()
    var ocrResults = [String: String]() // outline => letter
    let chars = self.characters!
    let allCharacters: [Character] = characterLines.flatMap { $0.flatMap { $0.characters } }
    // set filters unique outlines
    let unsolvedCharacters = allCharacters.filter { $0.letter == nil }.unique()
    var foundCharacters = [String]()
    // if necessary, run ocr
    if unsolvedCharacters.count > 0 {
      // write ocr string
      let ocrString = unsolvedCharacters.enumerated().map({ item in
        return chars.charToString(item.element, debugID: "")
      }).joined(separator: "\n")
      do {
        let path = NSURL.fileURL(withPath: "/tmp/characters.txt").absoluteURL
        try ocrString.write(to: path, atomically: true, encoding: .utf8)
      } catch {
        print("couldnt write pixel string \(error)")
      }
      debug("getOCR - characters.txt")
      // run ocr
      foundCharacters = ocr!.ocrCharacters()
    }
    // collect ocr results
    if foundCharacters.count != unsolvedCharacters.count {
      print("mismatch from in/out to ocr")
      return nil
    }
    for (index, char) in unsolvedCharacters.enumerated() {
      ocrResults[char.outline] = foundCharacters[index]
    }
    debug("getOCR - \(unsolvedCharacters.count) uniq / \(allCharacters.count), \(allCharacters.map({ return $0.completedOutline ? 0 : 1 }).reduce(0, +)) exhaust")
    return ocrResults
  }

  func getCharacters(_ sectionLines: Dictionary<Int, [LinePosition]>, box: Box, cgImage: CGImage, frame: [Int]) -> [[Word]] {
    startTime()
    // third loop
    // for each VERTICAL SECTION, get characters
    var allLines = [[Word]]() // store all lines
    let chars = self.characters!
    for id in sectionLines.keys {
      let scl = lineFindScaling
      let sectionLines: [[Word]] = sectionLines[id]!.pmap({ line, index in
        let padX = 12
        let padY = max(3, min(16, line.height / 8))
        print("line \(id) topfill \(line.topFillAmt) bottomfill \(line.bottomFillAmt)")
        //        let shiftUp = line.topFillAmt * 10 / line.bottomFillAmt * 10
        //        print("shiftUp \(shiftUp)")
        let lineFrame = [
          line.x * scl - padX + frame[0],
          line.y * scl - padY + frame[1],
          // add min in case padX/padY go too far
          min(frame[2], line.width * scl + padX * 3),
          min(frame[3], line.height * scl + padY * 3)
        ]
        // finds characters
        let foundWords: [Word] = chars.find(id: index, bounds: lineFrame)
        // debug line
        if simpleDebugImages || self.shouldDebug {
          images.writeCGImage(
            image: images.cropImage(cgImage, box: CGRect(x: lineFrame[0] - box.x, y: lineFrame[1] - box.y, width: lineFrame[2], height: lineFrame[3]))!,
            to: "\(box.screenDir!)/a-line-\(box.id)-\(id)-\(index).png"
          )
        }
        // write characters
        if self.shouldDebug { chars.shouldDebug = true }
        return foundWords
      })
      allLines = allLines + sectionLines
    }
    debug("getCharactersByLine")
    return allLines
  }

  func getVerticalSections(_ cgImage: CGImage, box: Box, frame: [Int], scale: Int) -> (Dictionary<Int, Int>, [[Int]]) {
    startTime()
    let vWidth = frame[2] / scale
    let vHeight = frame[3] / scale
    let maxWidth = cgImage.width - 1
    let maxHeight = cgImage.height - 1
    let verticalImageRep = NSBitmapImageRep(cgImage: cgImage)
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
        let x0 = max(0, min(maxWidth, frame[0] - box.x + x * scale))
        let y0 = max(0, min(maxHeight, frame[1] - box.y + y * scale))
        let filled = verticalImageRep.colorAt(x: x0, y: y0)!.brightnessComponent < 0.93
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
        let enoughWhitespace = colMiss > colMissMax
        let reachedEOL = x == vWidth - 1
        if (enoughWhitespace || reachedEOL) && colStreak - colMiss > colStreakMin { // set content block
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
    if simpleDebugImages || shouldDebug {
      var pixels = [PixelData]()
      for y in 0..<vHeight {
        for x in 0..<vWidth {
          let brt = UInt8(imgData[x][y] == 1 ? 0 : 255)
          pixels.append(PixelData(a: 255, r: brt, g: brt, b: brt))
        }
      }
      images.writeCGImage(image: images.imageFromArray(pixels: pixels, width: vWidth, height: vHeight)!, to: "\(box.screenDir!)/\(box.id)-section-find.png", resolution: 72) // write img
    }
    debug("getVerticalSections")
    return (verticalSections, imgData)
  }

  // sections to lines
  func getLines(_ verticalSections: Dictionary<Int, Int>, vWidth: Int, vHeight: Int, imgData: [[Int]]) -> Dictionary<Int, [LinePosition]> {
    startTime()
    // second loop - find lines in sections
    var sectionLines = Dictionary<Int, [LinePosition]>()
    let minLineWidth = 4
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
            var last = lines.last!
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
      // remove last line if its cut off by frame
      if lines.count > 0 {
        if lines.last!.y + lines.last!.height >= vHeight {
          lines.remove(at: lines.count - 1)
        }
      }
      sectionLines[start] = lines
    }
//    debug("getLines") // 0ms
    return sectionLines
  }

  func getContent(_ cgImage: CGImage, box: Box) -> [Int]? {
    startTime()
    var big = CGRect(x: 0, y: 0, width: 0, height: 0)
    let boxFindScale = 6
    let binarizedImage = filters.filterImageForContentFinding(image: cgImage, scale: boxFindScale)
    debug("getContent filter")
    if simpleDebugImages || shouldDebug {
      Async.background { images.writeCGImage(image: binarizedImage, to: "\(box.screenDir!)/\(box.id)-content-in.png") }
    }
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
    debug("getContent - \(boxes.count) boxes")
    return [ x, y, width, height ]
  }
  
  func getWordsAndLines(_ ocrResults: [String: String], characterLines: [[Word]]) -> ([String], [String]) {
    startTime()
    var words = [String]()
    var lines = [String]()
    for line in characterLines {
      if line.count == 0 {
        continue
      }
      var minY = 10000
      var maxH = 0
      for word in line {
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
      lines.append("[\(firstWord.x),\(minY / 2),\(width),\(maxH)]")
    }
    debug("getWordsAndLines")
    return (words, lines)
  }

  // returns the frame it found
  func handleChangedArea(box: Box, sampleBuffer: CMSampleBuffer, perRow: Int, findContent: Bool = false) -> Box? {
    let startAll = DispatchTime.now()
    let chars = self.characters!
    // clear old files
    if shouldDebug { rmAllInside(URL(fileURLWithPath: box.screenDir!)) }
    // create filtered images for content find
    let cgImage = filters.imageFromBuffer(context, sampleBuffer: sampleBuffer, cropRect: CGRect(
      x: box.x * 2,
      y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
      width: box.width * 2,
      height: Int(-box.height * 2)
    ))!
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
    if frame[2] < 10 || frame[3] < 10 {
      print("frame too small")
      return nil
    }
    chars.frameOffset = frame
    let vWidth = frame[2] / lineFindScaling
    let vHeight = frame[3] / lineFindScaling
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let (verticalSections, imgData) = getVerticalSections(cgImage, box: box, frame: frame, scale: lineFindScaling)
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let sectionLines = getLines(verticalSections, vWidth: vWidth, vHeight: vHeight, imgData: imgData)
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let charactersByLine = getCharacters(sectionLines, box: box, cgImage: cgImage, frame: frame)
    // find line bounds now so we can use them for nice OCR cropping
    startTime()
    let charactersByLineWithBounds: [[Word]] = charactersByLine.enumerated().map({ index, line in
      if line.count == 0 {
        return []
      }
      let x = line.first!.x
      var minY = 100000
      var width = 0
      var maxY = 0
      if line.count == 1 {
        width = line.first!.width
      } else {
        width = line.last!.x + line.last!.width - line.first!.x
      }
      // find min y and max height
      for word in line {
        if word.y + word.height > maxY { maxY = word.y + word.height }
        if word.y < minY { minY = word.y }
      }
      let height = maxY - minY
      let lineBounds = [x, minY, width, height]
      // hacky af
      return line.enumerated().map { (wordIndex, word) in
        var word = word
        word.characters = word.characters.enumerated().map { (charIndex, char) in
          var newChar = char
          newChar.lineBounds = lineBounds
          if self.shouldDebug { // debug: print out all characters
            _ = chars.charToString(newChar, debugID: "\(index)-\(wordIndex)-\(charIndex)")
          }
          return newChar
        }
        return word
      }
    })
    debug("process line bounds onto chars")
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    guard let ocrResults = getOCR(charactersByLineWithBounds) else { return nil }
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    let (words, lines) = getWordsAndLines(ocrResults, characterLines: charactersByLine)
    /* check continuation */ queue.wait(); if handleCancel() { return nil }
    // send to world
    self.send("{ \"action\": \"words\", \"value\": [\(words.joined(separator: ","))] }")
    self.send("{ \"action\": \"lines\", \"value\": [\(lines.joined(separator: ","))] }")
    // test write images:
    if self.shouldDebug {
      images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png")
    }
    // update character cache
    Async.utility(after: 0.04) { chars.updateCache(ocrResults) }
    // return new box with content adjusted frame
    print("done! \(lines.count) lines, \(words.count) words                \(Int(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000))ms")
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
}

