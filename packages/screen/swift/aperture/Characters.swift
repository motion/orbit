import AppKit

class Characters {
  private let images = Images()
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  private var shouldDebug = false
  private var debugImg: CGImage? = nil
  private var debugDir = ""

  init(data: UnsafeMutablePointer<UInt8>, perRow: Int, debug: Bool, debugDir: String?, debugImg: CGImage?) {
    self.shouldDebug = debug
    self.buffer = data
    self.perRow = perRow
    self.debugDir = debugDir ?? ""
    self.debugImg = debugImg
  }

  func find(id: Int, bounds: [Int]) -> [[Int]] {
    let start = DispatchTime.now()
    let MAX_LUMA = 80 // higher == allow lighter
    let imgX = bounds[0] * 2
    let imgY = bounds[1] * 2 + 23
    let imgW = bounds[2]
    let imgH = bounds[3]
    var foundChars = [[Int]]()
    var pixels: [PixelData]? = nil
    if debugImg != nil {
       pixels = [PixelData](repeating: PixelData(a: 255, r: 255, g: 255, b: 255), count: imgW * imgH)
    }
    var curChar = 0
    // we control the sticks for more speed
    var x = 0
    var y = 0
    let maxHeightCheck = imgH - imgH / 4
    while true {
      self.shouldDebug = curChar == 0
      // loop through from ltr, then ttb
      if y == imgH - 1 {
        x += 1
        y = 0
      } else {
        y += 1
      }
      // if reached last pixel, break
      if x >= imgW || y >= imgH || (x == imgW - 1 && y == imgH - 1) {
        break
      }
      // dont start on pixels close to bottom
      if y > maxHeightCheck {
        x += 1
        y = 0
        continue
      }
      // loop logic
      let xO = x * 2 + imgX
      let yO = y * 2 + imgY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < MAX_LUMA ? true : false
      if shouldDebug && debugImg != nil {
        pixels![x + y * imgW] = PixelData(a: 255, r: luma, g: luma, b: luma)
      }
      if isBlack {
        if shouldDebug && debugImg != nil {
          let charImgIn = images.cropImage(debugImg!, box: CGRect(x: xO / 2, y: yO / 2 - 24, width: 50, height: 50))
          images.writeCGImage(image: charImgIn, to: "/tmp/screen/a-line-\(id)-charIN-\(curChar).png")
        }
        let cb = self.findCharacter(
          startX: xO,
          startY: yO,
          maxHeight: imgH
        )
        foundChars.append(cb)
        if shouldDebug && debugImg != nil {
          images.writeCGImage(image: images.cropImage(debugImg!, box: CGRect(x: cb[0] / 2, y: cb[1] / 2 - 24, width: cb[2] / 2, height: cb[3] / 2)), to: "/tmp/screen/char-\(id)-\(curChar).png")
        }
        // after processing new char, move x to end of char
        x += cb[2] / 2 + 2
        y = 0
        curChar += 1
      }
    }
    if shouldDebug && debugImg != nil {
      if let img = images.imageFromArray(pixels: pixels!, width: imgW, height: imgH) {
        Images().writeCGImage(image: img, to: "/tmp/screen/a-line-\(id).png", resolution: 72) // write img
      }
    }
    if shouldDebug {
      print("Characters.find() \(foundChars.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    }
    return foundChars
  }

  func debug(_ str: String) {
    if shouldDebug {
      print(str)
    }
  }

  func findCharacter(startX: Int, startY: Int, maxHeight: Int) -> [Int] {
    var maxY = startY
    var maxX = startX
    var x = startX
    let blackLim = 125 // ensure breaks, lower = less black
    var foundAt = Dictionary<Int, Bool>()
    var foundPixels = true
    var firstLoop = true
    while foundPixels {
      print("move row")
      if !firstLoop {
        x += 1
      }
      foundPixels = false
      for yOff in 0...maxHeight {
        let yP = yOff + startY
        let curPos = yP * perRow + x
        print("\(yP) \(maxY) \(yOff) \(buffer[curPos] < blackLim)")
        if buffer[curPos] < blackLim {
          // count it if the leftward pixels touch
          let leftPx = foundAt[yP * perRow + x - 1]
          let leftUpPx = foundAt[(yP - 1) * perRow + x - 1]
          let leftDownPx = foundAt[(yP + 1) * perRow + x - 1]
          if firstLoop || leftPx != nil || leftUpPx != nil || leftDownPx != nil {
            foundAt[curPos] = true
            foundPixels = true
            maxX = x
            if yP > maxY {
              print("new bottom right \(x), \(maxHeight) \(startY)")
              maxY = yP
            }
          }
        }
        firstLoop = false
      }
    }
    return [
      startX,
      startY,
      maxX - startX,
      maxY - startY
    ]
  }

  public func charsToString(rects: [[Int]], debugID: Int) -> String {
    //    let start = DispatchTime.now()
    var output = ""
    let dbl = Float(28)
    for (index, rect) in rects.enumerated() {
      let minX = rect[0]
      let minY = rect[1]
      if rect[3] == 0 || rect[2] == 0 {
        debug("empty char")
        continue
      }
      let width = Float(rect[2])
      let height = Float(rect[3])
      // make square
      var scaleX = Float(1)
      var scaleY = Float(1)
      if width > dbl {
        scaleX = width / dbl
      } else if width < dbl {
        scaleX = 1 / (dbl / width)
      }
      if height > dbl {
        scaleY = height / dbl
      } else if height < dbl {
        scaleY = 1 / (dbl / height)
      }
      var pixels: [PixelData]? = nil
      if debugID > -1 {
        pixels = [PixelData]()
      }
      for y in 0..<28 {
        for x in 0..<28 {
          let xS = Int(Float(x) * scaleX)
          let yS = Int(Float(y) * scaleY)
          let luma = buffer[(minY + yS) * perRow + minX + xS]
          let lumaVal = luma < 150 ? "0 " : "255 " // warning, doing any sort of string conversion here slows it down bigly
          output += lumaVal
          if debugID > -1 {
            let brt = UInt8(luma < 150 ? 0 : 255)
            pixels!.append(PixelData(a: 255, r: brt, g: brt, b: brt))
          }
        }
      }
      output += "\n"
      if debugID > -1 {
        let outFile = "\(debugDir)/x-line-\(debugID)-char-\(index).png"
        self.debug("write \(outFile)")
        images.writeCGImage(image: images.imageFromArray(pixels: pixels!, width: 28, height: 28)!, to: outFile, resolution: 72) // write img
      }
    }
    //    print(".. char => string: \(rects.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return output
  }
}

