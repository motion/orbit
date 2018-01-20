import Foundation
import AVFoundation
import AppKit

let threads = 2

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

final class Recorder: NSObject {
  private let input: AVCaptureScreenInput
  private var session: AVCaptureSession
  private var output: AVCaptureVideoDataOutput
  private var sensitivity: Int
  private var sampleSpacing: Int
  private var firstTime: Bool
  private let context = CIContext()
  private var boxes: [String: Box]
  private var lastBoxes: [String: Array<UInt32>]
  private let displayId: CGDirectDisplayID
  private let components = ConnectedComponentsSwiftOCR()

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
    self.firstTime = true
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
  
  func screenshotBox(box: Box, buffer: CMSampleBuffer, bufferPointer: UnsafeMutablePointer<UInt32>, perRow: Int, findContent: Bool = false) {
    let startAll = DispatchTime.now()

    if (box.screenDir == nil) {
      print("no screen dir")
      return
    }
    // clear old files
    rmAllInside(URL(fileURLWithPath: box.screenDir!))
    // craete filtered images for content find
    let outPath = "\(box.screenDir ?? "/tmp")/\(box.id).png"
    let cropRect = CGRect(
      x: box.x * 2,
      y: Int(CGDisplayPixelsHigh(self.displayId) * 2 - Int(box.y * 2)),
      width: box.width * 2,
      height: Int(-box.height * 2)
    )
    guard let cgImageLarge = images.imageFromSampleBuffer(context, sampleBuffer: buffer, cropRect: cropRect) else { return }
    let width = Int(cropRect.width / 2)
    let height = Int(cropRect.height / 2)
    guard let cgImage = images.resize(cgImageLarge, width: width, height: height) else { return }
    if (!findContent) {
      images.writeCGImage(image: cgImage, to: outPath)
      return
    }
    var start = DispatchTime.now()
    var biggestBox: BoundingBox?
    let boxFindScale = 8
    var binarizedImage = filters.filterImageForContentFinding(image: cgImage)
    binarizedImage = images.resize(binarizedImage, width: width / boxFindScale, height: height / boxFindScale)!
    binarizedImage = filters.filterImageForContentFindingSecondPass(image: binarizedImage)
    let cc = ConnectedComponents()
    let result = cc.labelImageFast(image: binarizedImage, calculateBoundingBoxes: true, invert: true)
    print("1. content finding: \(result.boundingBoxes!.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
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
    let bX = bb.x_start * boxFindScale
    let bY = bb.y_start * boxFindScale
    let bW = bb.getWidth() * boxFindScale
    let bH = bb.getHeight() * boxFindScale
    let cropBox = CGRect(x: bX, y: bY, width: bW, height: bH)
    let cropBoxLarge = CGRect(x: bX * 2, y: bY * 2, width: bW * 2, height: bH * 2)
    print("! [\(bX), \(bY), \(bW), \(bH)]")
    if box.screenDir == nil {
      return
    }
    start = DispatchTime.now()
    let ocrWriteImage = images.cropImage(filters.filterImageForOCR(image: cgImageLarge), box: cropBoxLarge)
    let ocrCharactersImage = images.cropImage(filters.filterImageForOCRCharacterFinding(image: cgImage), box: cropBox)
    print("2. filter for ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    
    // find vertical sections
    start = DispatchTime.now()
    let vScale = 4 // scale down amount
    let vWidth = bW / vScale
    let vHeight = bH / vScale
    let verticalImage = filters.filterForVerticalContentFinding(image: images.resize(ocrCharactersImage, width: vWidth, height: vHeight)!)
    print("3. filter vertical: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    
    // test write image:
    images.writeCGImage(image: verticalImage, to: "\(box.screenDir!)/\(box.id)-vertical-content-find.png")
    
    // find lines
    start = DispatchTime.now()
    let verticalImageRep = NSBitmapImageRep(cgImage: verticalImage)
    // first loop
    // find vertical areas + store some word info
    var verticalBreaks = Dictionary<Int, Int>() // used to track white streaks
    var blacks = [[Int]](repeating: [Int](repeating: 0, count: Int(vWidth)), count: Int(vHeight)) // height (y) first
    var verticalIgnore = Dictionary<Int, Bool>() // x => shouldIgnore
    for x in 0..<vWidth {
      verticalBreaks[x] = 0
      for y in 0..<vHeight {
        let isBlack = verticalImageRep.colorAt(x: x, y: y)!.brightnessComponent == 0.0
        if isBlack {
          blacks[y][x] = 1
        } else {
          let leniancy = 3
          // is white
          if verticalBreaks[x]! > y - leniancy {
            verticalBreaks[x] = verticalBreaks[x]! + 1
          }
          // count nearly empty columns as empty (subtract here determines leniancy)
          if verticalBreaks[x]! > vHeight - leniancy {
            verticalIgnore[x] = true
//              vWidthMin -= 1
//              print("found a vertical split at \(x)")
            break
          }
        }
      }
    }
    // TODO reenable, dont do vertical checks for now
    verticalIgnore = Dictionary<Int, Bool>()
    print("4. find verticals: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    // second loop
    // loop over vertical blocks and store lines
    // max sections is the max number of vertical breaks itll find
    let MAX_SECTIONS = 80
    var streaks = [[Int]](repeating: [Int](repeating: 0, count: Int(vHeight)), count: MAX_SECTIONS)
    var sectionOffsets = [Int](repeating: 0, count: MAX_SECTIONS) // vID => x
    typealias Lines = Dictionary<Int, Bool>
    var sectionLines = [Lines]()
    var lastLine: Lines? = nil
    var vID = 0 // tracks current vertical column id
    for x in 0..<vWidth {
      if verticalIgnore[x] == true {
        continue
      }
      // coming out of a ignore area or first col is contentful
      if x == 0 || verticalIgnore[x - 1] == true {
        if lastLine != nil {
          sectionLines.append(lastLine!)
        }
        lastLine = Lines()
        vID += 1
        sectionOffsets[vID] = x
      }
      // were in a valid col
      for y in 0..<vHeight {
        if blacks[y][x] == 1 {
          streaks[vID][y] += 1
          // this comparison is the low bound for the num of pixels until we consider it a word
          if streaks[vID][y] > 6 {
            lastLine![y] = true
          }
        }
      }
    }
    sectionLines.append(lastLine!)
    print("5. found \(sectionLines.count) lines: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    // third loop
    // for each VERTICAL SECTION, join together lines that need be
    for (index, section) in sectionLines.enumerated() {
      let id = index + 1 // vId is always one above this
      let xOffset = max(0, sectionOffsets[id] * vScale - vScale)
      var lWidth: Int = 0
      if sectionOffsets[id + 1] != 0 {
        lWidth = sectionOffsets[id + 1] * vScale - xOffset
      } else {
        lWidth = vWidth * vScale - xOffset
      }
      // 3.1 loop: find connected lines and join them
//        print("lines at: \(section.keys.sorted())")
      let rawLines = section.keys.sorted()
      var lines = [[Int]]()
      var curIndex = 0
      for (index, curVal) in rawLines.enumerated() {
        if index == 0 { // first time
          lines.append([curVal, curVal]) // [3, 3]
          continue
        }
        // lineNum = [3, 4, 10, 11, ...]
        var curLine = lines[curIndex] // [23, 24]
        if curVal == curLine[1] + 1 {
          curLine[1] = curVal
          lines[curIndex] = curLine
        } else {
          // not the same, start a new one
          curIndex += 1
          lines.append([curVal, curVal])
        }
      }
      print("6. join, \(lines.count) lines: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      start = DispatchTime.now()
      var start2 = 0.0
      var start3 = 0.0
      // 3.2 loop; cut lines (this could be joined into last loop for speed demons)
      let lineThreads = lines.count % 2 == 0 ? threads : 1
      let perThread = lines.count / lineThreads
      let queue = DispatchQueue(label: "asyncQueue", attributes: .concurrent)
      let group = DispatchGroup()
      var foundTotal = 0
      var lineStrings = [String](repeating: "", count: lines.count)
      for thread in 0..<lineThreads {
        group.enter()
        queue.async {
          let startIndex = thread * perThread
          for index in startIndex..<(startIndex + perThread) {
            // we use this at the end to write out everything
            var charRects = [CGRect]()
            let lineRange = lines[index]
            let lHeight = (lineRange[1] - lineRange[0] + 1) * vScale
            let yOffset = lineRange[0] * vScale
            let vPadExtra = 6
            // get bounds
            let bounds = [xOffset, yOffset - vPadExtra, lWidth, lHeight + vPadExtra * 2]
            // testing: write out image
            let rect = CGRect(x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3])
            let lineImg = images.cropImage(ocrCharactersImage, box: rect)
//            let nsBinarizedImage = NSImage.init(cgImage: lineImg, size: NSZeroSize)
            var innerTime = DispatchTime.now()
            let rects = self.components.extractBlobs(bounds: bounds, bufferPointer: bufferPointer, perRow: perRow, frameOffset: [bX, bY])
            // inner timer
            start2 += Double(DispatchTime.now().uptimeNanoseconds - innerTime.uptimeNanoseconds) / 1_000_000
            innerTime = DispatchTime.now()
            foundTotal += rects.count
            images.writeCGImage(image: lineImg, to: "\(box.screenDir!)/\(box.id)-section-\(id)-line-\(index).png")
            // gather char rects
            for (charIndex, bb) in rects.enumerated() {
              let charRect = CGRect(
                x: (bounds[0] + Int(bb.minX)) * 2,
                y: (bounds[1] + Int(bb.minY)) * 2,
                width: Int(bb.width) * 2,
                height: Int(bb.height) * 2
              )
//              let charImg = images.resize(images.cropImage(ocrWriteImage, box: charRect), width: 28, height: 28)!
//              images.writeCGImage(image: charImg, to: "\(box.screenDir!)/\(box.id)-section-\(id)-line-\(index)-char-\(charIndex).png")
              charRects.append(charRect)
            }
            // write characters
            let chars = self.charToString(lineNum: index, bufferPointer: bufferPointer, perRow: perRow, rects: charRects, frameOffset: [bX, bY], outDir: box.screenDir!)
            lineStrings.insert(chars, at: index)
            start3 += Double(DispatchTime.now().uptimeNanoseconds - innerTime.uptimeNanoseconds) / 1_000_000
          }
          group.leave()
        }
      }
      group.wait()
      print("7. found \(foundTotal) chars: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms (cc: \(start2), string: \(start3))")
      start = DispatchTime.now()
      // write chars
      do {
        let path = NSURL.fileURL(withPath: "\(box.screenDir!)/characters.txt").absoluteURL
        try lineStrings.joined(separator: "\n").write(to: path, atomically: true, encoding: .utf8)
      } catch {
        print("couldnt write pixel string \(error)")
      }
      print("8. characters.txt: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    }
    
    print("")
    print("total \(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000)ms")

    // for testing write out og images too
    images.writeCGImage(image: binarizedImage, to: "\(box.screenDir!)/\(box.id)-full.png")
    images.writeCGImage(image: ocrWriteImage, to: outPath)
    images.writeCGImage(image: ocrCharactersImage, to: "\(box.screenDir!)/\(box.id)-binarized.png")
  }
  
  func charToString(lineNum: Int, bufferPointer: UnsafeMutablePointer<UInt32>, perRow: Int, rects: [CGRect], frameOffset: [Int], outDir: String) -> String {
//    let start = DispatchTime.now()
    var output = ""
    let dbl = Float(56)
    let frameX = CGFloat(frameOffset[0])
    let frameY = CGFloat(frameOffset[1]) + 24  // 24 == titlebar??
    for (index, rect) in rects.enumerated() {
      let minX = rect.minX / 2
      let minY = rect.minY / 2
      let width = Float(rect.width)
      let height = Float(rect.height)
      // make square
      var scaleW = Float(1)
      var scaleH = Float(1)
      if width > dbl {
        scaleW = dbl / width
      } else if width < dbl {
        scaleW = width / dbl
      }
      if height > dbl {
        scaleH = dbl / height
      } else if height < dbl {
        scaleH = height / dbl
      }
      var pixels = [PixelData]() // write img
      let realX = Int(minX + frameX)
      let realY = Int(minY + frameY)
      let yScale = perRow / 2
      for y in 0..<28 {
        for x in 0..<28 {
          let xS = Int(Float(x) * scaleW)
          let yS = Int(Float(y) * scaleH)
          let luma = bufferPointer[(realY + yS) * yScale + (realX + xS)]
          let lumaVal = luma > 3555985190 ? "0 " : "255 " // warning, doing any sort of string conversion here slows it down bigly
          output += lumaVal
          let brightness = UInt8(luma / 3951094656 * 255)
          pixels.append(PixelData(a: 255, r: brightness, g: brightness, b: brightness))
        }
      }
      output += "\n"
      images.writeCGImage(image: images.imageFromArray(pixels: pixels, width: 28, height: 28)!, to: "\(outDir)/x-line-\(lineNum)-char-\(index).png", resolution: 72) // write img
    }
//    print(".. char => string: \(rects.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return output
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
    // why doesnt this work :(
//    if connection.videoOrientation.rawValue == 1 {
//      connection.videoOrientation = .landscapeRight
//      connection.isVideoMirrored = true
//      return
//    }
    
    // let start = DispatchTime.now()
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
    let int32Buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt32>.self)
    let int32PerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      if (firstTime && box.initialScreenshot || hasBoxChanged(box: box, buffer: int32Buffer, perRow: int32PerRow)) {
        screenshotBox(box: box, buffer: sampleBuffer, bufferPointer: int32Buffer, perRow: int32PerRow, findContent: box.findContent)
        print(">\(box.id)")
      }
    }

    // only true for first loop
    self.firstTime = false

    // release
    CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
//    let end = DispatchTime.now()
//    let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
//    let timeInterval = Double(nanoTime) / 1_000_000
//    print("frame \(timeInterval) ms")
  }
}
