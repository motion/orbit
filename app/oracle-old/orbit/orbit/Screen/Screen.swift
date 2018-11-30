import Foundation
import AVFoundation
import AppKit

let shouldDebugTiming = true

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
  let ocr: Bool
}

// constants
let lineFindScaling = 4 // scale down denominator

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

final class Screen: NSObject {
  var isRunning = false
  var isPaused = false
  var isScanning = false
  var fps = 0
  var ignoreNextScan = false
  var shouldCancel = false
  var shouldRunNextTime = false
  
  var emit: (String)->Void
  var queue: AsyncGroup
  var isCleared = [Int: Bool]()
  var currentSampleBuffer: CMSampleBuffer?
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
  var changeHandle: AsyncBlock<Void, ()>?
  var onStart: (() -> Void)?
  var onFinish: (() -> Void)?
  var onError: ((Error) -> Void)?
  var inPipe: Pipe
  var outFile: URL

  private let simpleDebugImages = ProcessInfo.processInfo.environment["DEBUG_IMAGES"] == "true"

  init(emit: @escaping (String)->Void, queue: AsyncGroup, displayId: CGDirectDisplayID = CGMainDisplayID()) throws {
    self.emit = emit
    self.queue = queue

    // start video
    self.displayId = displayId
    self.session = AVCaptureSession()
    self.input = AVCaptureScreenInput(displayID: displayId)!
    output = AVCaptureVideoDataOutput()

//    print("output types: \(output.availableVideoCodecTypes) \(output.availableVideoPixelFormatTypes)")

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
    self.inPipe = Pipe()
    
    // ocr outfile
    guard let path = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first else {
      print("err ocr file path")
      exit(1)
    }
    guard let writePath = NSURL(fileURLWithPath: path).appendingPathComponent("OCR") else {
      print("err ocr write path")
      exit(1)
    }
    try? FileManager.default.createDirectory(atPath: writePath.path, withIntermediateDirectories: true)
    self.outFile = writePath.appendingPathComponent("out.txt")

    super.init()
    
    // setup ocr process/file
    if let path = Bundle.main.path(forResource: "run/run", ofType: nil) {
      print("got python path \(path)")
      let task = Process()
      task.launchPath = path
      task.arguments = []
      task.standardInput = inPipe
      let outPath = self.outFile.absoluteString.replacingOccurrences(of: "file://", with: "")
      print("outPath \(outPath)")
      task.environment = [ "OUTFILE": outPath ]
      task.launch()
      print("dun")
    } else {
      print("no python path!")
      exit(1)
    }

    // setup recorder
    output.alwaysDiscardsLateVideoFrames = true
    let queue = DispatchQueue(label: "com.me.myqueue")

    print("setup sample buffer")
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

  func ocrCharacters() -> [String] {
    do {
      try "".write(to: self.outFile, atomically: false, encoding: .utf8)
      self.inPipe.fileHandleForWriting.write("x\n".data(using: .utf8)!)
      var out: String
      while(true) {
        sleep(1 / 5)
        out = try String(contentsOf: self.outFile, encoding: .utf8)
        if (out.count > 0) {
          let data = out.data(using: .utf8)!
          if let jsonArray = try JSONSerialization.jsonObject(with: data, options : .allowFragments) as? [String] {
            return jsonArray
          } else {
            print("no bueno")
            return []
          }
        }
      }
    } catch {
      print("errrrrrrrrrr")
    }
    return []
  }

  func start() {
    if self.isRunning {
      return
    }
    print("starting...")
    self.isRunning = true
    if self.shouldCancel {
      self.shouldRunNextTime = true
    }
    print("Screen.start")
    self.shouldCancel = false
    session.startRunning()
    self.emit("{ \"state\": { \"isRunning\": true, \"isPaused\": false } }")
  }

  func stop() {
    print("Screen.stop (isRunning: \(self.isRunning))")
    if !self.isRunning {
      return
    }
    self.isRunning = false
    session.stopRunning()
    self.emit("{ \"state\": { \"isRunning\": false } }")
  }

  func resume() {
    print("Screen.resume (isPaused: \(self.isPaused))")
    self.isPaused = false
    self.start()
    self.emit("{ \"state\": { \"isPaused\": false } }")
  }

  func pause() {
    print("Screen.pause (isPaused: \(self.isPaused))")
    self.isPaused = true
    self.stop()
    self.emit("{ \"state\": { \"isPaused\": true } }")
  }

  func debug(_ str: String) {
    if shouldDebugTiming {
      if curTime != nil {
        let timeEnd = Int(Double(DispatchTime.now().uptimeNanoseconds - curTime!.uptimeNanoseconds) / 1_000_000)
//        print("\(str.padding(toLength: 36, withPad: " ", startingAt: 0)) \(timeEnd)ms")
        print("\(str.padding(toLength: 36, withPad: " ", startingAt: 0)) \(timeEnd)ms")
        curTime = DispatchTime.now()
      } else {
        print("\(str)")
      }
    }
  }

  private var curTime: DispatchTime?
  func startTime() {
    curTime = DispatchTime.now()
  }

  func clear() {
    self.ignoreNextScan = false
    if self.isScanning {
      self.shouldCancel = true
    }
    if let handle = self.changeHandle {
      handle.cancel()
      self.changeHandle = nil
    }
  }

  func watchBounds(fps: Int, boxes: Array<Box>, showCursor: Bool, videoCodec: String? = nil, sampleSpacing: Int, sensitivity: Int, debug: Bool) {
    self.clear()
    self.shouldDebug = debug
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
    self.input.minFrameDuration = CMTimeMake(value: 1, timescale: Int32(fps))
  }

  func shouldBreak() -> Bool {
    queue.wait()
    let val = self.shouldCancel
    if val { print("---------------------- canceling! ---------------------") }
    self.shouldCancel = false
    return val
  }

  func getOCR(_ characterLines: [[Word]]) throws -> [String: String]? {
    startTime()
    var ocrResults = [String: String]() // outline => letter
    let chars = self.characters!
    let allCharacters: [Character] = characterLines.flatMap { $0.flatMap { $0.characters } }
    let uniqCharacters = allCharacters.unique()
    let unsolvedCharacters = uniqCharacters.filter { $0.letter == nil }
    // return early! every char is already known
    if unsolvedCharacters.count == 0 {
      for char in uniqCharacters {
        ocrResults[char.outline] = char.letter
      }
      return ocrResults
    }
    // write id string
    var idString = ""
    for word in characterLines.flatMap({ $0 }) {
      for char in word.characters {
        let uid = char.letter != nil ? "$\(char.letter!) " : "\(unsolvedCharacters.index(of: char)!) "
        idString += uid
      }
      idString += "-1 "
    }
    try idString.write(to: NSURL.fileURL(withPath: "/tmp/characters-full.txt").absoluteURL, atomically: true, encoding: .utf8)
    // set filters unique outlines
    var foundCharacters = [String]()
    // if necessary, run ocr
    if unsolvedCharacters.count > 0 {
      // write ocr string
      let ocrString = unsolvedCharacters.enumerated().map({ item in
        return chars.charToString(item.element, debugID: "")
      }).joined(separator: "\n")
      try ocrString.write(to: NSURL.fileURL(withPath: "/tmp/characters.txt").absoluteURL, atomically: true, encoding: .utf8)
      debug("getOCR - characters.txt")
      // run ocr
      foundCharacters = ocrCharacters()
    }
    // collect ocr results
    if foundCharacters.count != unsolvedCharacters.count {
      print("mismatch from in/out to ocr")
      return nil
    }
    for (index, char) in unsolvedCharacters.enumerated() {
      ocrResults[char.outline] = foundCharacters[index]
    }
    debug("getOCR done :) - \(unsolvedCharacters.count) uniq / \(allCharacters.count), \(allCharacters.map({ return $0.completedOutline ? 0 : 1 }).reduce(0, +)) exhaust")
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
        let padY = max(3, min(16, line.height / 10))
//        print("section \(id) line \(index) topfill \(line.topFillAmt) bottomfill \(line.bottomFillAmt)")
//        print("shiftUp \(line.topFillAmt) shiftDown \(line.bottomFillAmt)")
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
        if self.simpleDebugImages {
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
        let filled = verticalImageRep.colorAt(x: x0, y: y0)!.brightnessComponent < 0.99
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
    let minLineWidth = 5
    for (start, end) in verticalSections {
      var lines = [LinePosition]()
      var lineStreak = 0
      var lastLineFillPx = 0
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
        let isFilled = lineFilledPx >= minLineWidth
        if !isFilled {
          lastLineFillPx = lineFilledPx
          lineStreak = 0
          // when we find a clear line, update last line with its trailing pixels
          if lineFilledPx > 0, var lastLine = lines.last {
            if lastLine.y + lastLine.height == y - 1 {
              lastLine.bottomFillAmt = lineFilledPx
              lines[lines.count - 1] = lastLine
            }
          }
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
                topFillAmt: lastLineFillPx,
                bottomFillAmt: 0
              )
            )
          }
        }
        // update last line filled after filling in
        lastLineFillPx = lineFilledPx
      }
      // remove last line if its cut off by frame
      if lines.count > 0 {
        if lines.last!.y + lines.last!.height >= vHeight {
          lines.remove(at: lines.count - 1)
        }
      }
      let filteredLines = lines.filter { $0.height < vHeight / 10 }
      if filteredLines.count < lines.count {
        debug("filtered \(lines.count - filteredLines.count) big lines")
      }
      sectionLines[start] = filteredLines
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
//    startTime()
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
//    debug("getWordsAndLines")
    return (words, lines)
  }

  func charactersWithLineBounds(_ charactersByLine: [[Word]]) -> [[Word]] {
//    startTime()
    var i = 0
    let result: [[Word]] = charactersByLine.map({ line in
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
            _ = self.characters!.charToString(newChar, debugID: "\(i)")
            i += 1
          }
          return newChar
        }
        return word
      }
    })
//    debug("charactersWithLineBounds")
    return result
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
    // debug
    if shouldDebug {
      chars.debugImg = filters.filterImageForOCRCharacterFinding(image: cgImage)
      Async.background { images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png") }
    }
    if shouldBreak() {
      return nil
    }
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
    if shouldBreak() { return nil }
    let (verticalSections, imgData) = getVerticalSections(cgImage, box: box, frame: frame, scale: lineFindScaling)
    if shouldBreak() { return nil }
    let sectionLines: Dictionary<Int, [LinePosition]> = getLines(verticalSections, vWidth: vWidth, vHeight: vHeight, imgData: imgData)
    if shouldBreak() { return nil }
    let charactersByLine: [[Word]] = getCharacters(sectionLines, box: box, cgImage: cgImage, frame: frame)
    // find line bounds now so we can use them for nice OCR cropping
    let charactersByLineWithBounds: [[Word]] = charactersWithLineBounds(charactersByLine)
    if shouldBreak() { return nil }
    if box.ocr {
      do {
        guard let ocrResults = try getOCR(charactersByLineWithBounds) else { return nil }
        if shouldBreak() { return nil }
        let (words, lines) = getWordsAndLines(ocrResults, characterLines: charactersByLine)
        if shouldBreak() { return nil }
        // send to world
        self.emit("{ \"action\": \"words\", \"value\": [\(words.joined(separator: ","))] }")
        self.emit("{ \"action\": \"lines\", \"value\": [\(lines.joined(separator: ","))] }")
        // update character cache
        Async.utility(after: 0.04) { chars.updateCache(ocrResults) }
//        print("recognized \(lines.count) lines, \(words.count) words")
      } catch {
        print("ocr failed...")
      }
    } else {
      print("found \(charactersByLineWithBounds.flatMap { $0.flatMap { $0.characters } }.count) characters")
      self.emit("{ \"action\": \"words\", \"value\": [] }")
    }
    // test write images:
    if self.shouldDebug { images.writeCGImage(image: cgImage, to: "\(box.screenDir!)/\(box.id)-original.png") }
    // return new box with content adjusted frame
    print("total: \(Int(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000))ms")
    return Box(
      id: box.id,
      x: frame[0],
      y: frame[1],
      width: frame[2],
      height: frame[3],
      screenDir: box.screenDir,
      findContent: false, // now false on finding new content
      initialScreenshot: box.initialScreenshot,
      ocr: box.ocr
    )
  }
}

