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
  
  func screenshotBox(box: Box, buffer: CMSampleBuffer, findContent: Bool = false) {
    let startAll = DispatchTime.now()
    if (box.screenDir != nil) {
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
      print("2. filtering image for ocr: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      
      // find vertical sections
      start = DispatchTime.now()
      let vScale = 4 // scale down amount
      let vWidth = bW / vScale
      let vHeight = bH / vScale
      let verticalImage = filters.filterForVerticalContentFinding(image: images.resize(ocrCharactersImage, width: vWidth, height: vHeight)!)
      print("2.1 filter: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      
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
              print("found a vertical split at \(x)")
              break
            }
          }
        }
      }
      // second loop
      // loop over vertical blocks and store lines
      // max sections is the max number of vertical breaks itll find
      let MAX_SECTIONS = 8
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
      print("vertical sections \(sectionLines.count)")
      // third loop
      // for each VERTICAL SECTION, join together lines that need be
      // collects info into sectionLineBounds: section => line => [start, end, width, height]
      var sectionLineBounds = [[[Int]]]()
      for (index, section) in sectionLines.enumerated() {
        let id = index + 1 // vId is always one above this
        let xOffset = sectionOffsets[id] * vScale - vScale
        var lWidth: Int = 0
        if sectionOffsets[id + 1] != 0 {
          lWidth = sectionOffsets[id + 1] * vScale - xOffset
        } else {
          lWidth = vWidth * vScale - xOffset
        }
        // 3.1 loop: find connected lines and join them
        print("lines at: \(section.keys.sorted())")
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
        print("found contiguous lines: \(lines)")
        // 3.2 loop
        // cut lines (this could be joined into last loop for speed demons)
        var lineBounds = [[Int]]()
        for (index, lineRange) in lines.enumerated() {
          let lHeight = (lineRange[1] - lineRange[0] + 1) * vScale
          let yOffset = lineRange[0] * vScale
          print("line bounds: x \(xOffset) y \(yOffset) w \(lWidth) h \(lHeight)")
          let vPadExtra = 6
          // get bounds
          let bounds = [xOffset, yOffset - vPadExtra, lWidth, lHeight + vPadExtra * 2]
          lineBounds.append(bounds)
          // testing: write out image
          let rect = CGRect(x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3])
          let lineImg = images.cropImage(ocrCharactersImage, box: rect)
          images.writeCGImage(image: lineImg, to: "\(box.screenDir!)/\(box.id)-section-\(id)-line-\(index).png")
        }
      }
      print("2.1. line loop: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
      
      // cut out characters
      self.writeCharacters(binarizedImage: ocrCharactersImage, outputImage: ocrWriteImage, to: box.screenDir!)
      print("\ndone in \(Double(DispatchTime.now().uptimeNanoseconds - startAll.uptimeNanoseconds) / 1_000_000)ms\n")

      // for testing write out og images too
      images.writeCGImage(image: binarizedImage, to: "\(box.screenDir!)/\(box.id)-full.png")
      images.writeCGImage(image: ocrWriteImage, to: outPath)
      images.writeCGImage(image: ocrCharactersImage, to: "\(box.screenDir!)/\(box.id)-binarized.png")
    }
  }
  
  func writeCharacters(binarizedImage: CGImage, outputImage: CGImage, to outDir: String) {
    var start = DispatchTime.now()
    let cc = ConnectedComponentsSwiftOCR()
    let nsBinarizedImage = NSImage.init(cgImage: binarizedImage, size: NSZeroSize)
    let rects = cc.extractBlobs(nsBinarizedImage)
    print("3. character finding: \(rects.count), \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    let outputImageRep = NSBitmapImageRep(cgImage: outputImage)
//    print("dimensions [\(outputImageRep.pixelsWide), \(outputImageRep.pixelsHigh)]")
    
    var pixelString = ""
    let threads = 2
    let perThread = rects.count / threads
    let queue = DispatchQueue(label: "asyncQueue", attributes: .concurrent)
    let group = DispatchGroup()
    var strings = [String].init(repeating: "", count: threads)
      
    for thread in 0..<threads {
      group.enter()
      queue.async {
        let startIndex = thread * perThread
        for index in startIndex..<(startIndex + perThread) {
          let rect = rects[index]
          let writeRetina = 1
          let minX = Double(rect.minX) * 2
          let minY = Double(rect.minY) * 2
          let width = Double(rect.maxX) * 2 - minX
          let height = Double(rect.maxY) * 2 - minY
          // make square
          var scaleW = 1.0
          var scaleH = 1.0
          if width > 56 {
            scaleW = 56 / width
          } else if width < 56 {
            scaleW = width / 56
          }
          if height > 56 {
            scaleH = 56 / height
          } else if height < 56 {
            scaleH = height / 56
          }
          scaleW = scaleW * Double(writeRetina)
          scaleH = scaleH * Double(writeRetina)
          // double for retina
          var str = ""
          for x in 0..<(28 * writeRetina) {
            for y in 0..<(28 * writeRetina) {
              let realX = Double(x) * scaleW + minX
              let realY = Double(y) * scaleH + minY
              var luminance = 1.0 // white
              let pColor = outputImageRep.colorAt(x: Int(realX), y: Int(realY))
              if pColor != nil {
                luminance = Double(pColor!.brightnessComponent)
              }
              str += luminance.description + " "
            }
          }
          strings[thread] += str + "\n"
        }
        group.leave()
      }
    }

    group.wait()
    
    pixelString = strings.joined(separator: "\n")
    print("4. characters => string: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()
    do {
      let path = NSURL.fileURL(withPath: "\(outDir)/characters.txt").absoluteURL
      try pixelString.write(to: path, atomically: true, encoding: .utf8)
    } catch {
      print("couldnt write pixel string \(error)")
    }
    print("5. write string: \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
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
        screenshotBox(box: box, buffer: sampleBuffer, findContent: box.findContent)
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
