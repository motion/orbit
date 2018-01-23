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
    let imgX = bounds[0] * 2
    let imgY = bounds[1] * 2
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
    while true {
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
      // loop logic
      let xO = x * 2 + imgX
      let yO = y * 2 + imgY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < 3 ? true : false
      if debugImg != nil {
        pixels![x + y * imgW] = PixelData(a: 255, r: luma, g: luma, b: luma)
      }
      if isBlack {
        if debugImg != nil {
          let charImgIn = images.cropImage(debugImg!, box: CGRect(x: xO / 2, y: yO / 2 - 24, width: 50, height: 50))
          images.writeCGImage(image: charImgIn, to: "/tmp/screen/a-line-\(id)-charIN-\(curChar).png")
        }
        self.shouldDebug = id == 0 && curChar == 6
        let cb = self.findCharacter(startX: xO, startY: yO)
        foundChars.append(cb)
        if debugImg != nil {
          images.writeCGImage(image: images.cropImage(debugImg!, box: CGRect(x: cb[0] / 2, y: cb[1] / 2 - 24, width: cb[2] / 2, height: cb[3] / 2)), to: "/tmp/screen/char-\(id)-\(curChar).png")
        }
        // after processing new char, move x to end of char
        x += cb[2] / 2 + 1
        y = 0
        print("char \(curChar) bounds \(cb), x now \(x)")
        curChar += 1
      }
    }
    if debugImg != nil {
      if let img = images.imageFromArray(pixels: pixels!, width: imgW, height: imgH) {
        Images().writeCGImage(image: img, to: "/tmp/screen/a-line-\(id).png", resolution: 72) // write img
      }
    }
    if shouldDebug {
      print("  Characters.find() \(foundChars.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    }
    return foundChars
  }

  func debug(_ str: String) {
    if shouldDebug {
      print(str)
    }
  }

  func findCharacter(startX: Int, startY: Int) -> [Int] {
    let LEFT = 0
    let UP = 1
    let RIGHT = 2
    let DOWN = 3
    var startPoint = [startX, startY] // top left point
    debug("startPoint \(startPoint)")
    var endPoint = [startX, startY] // bottom right point
    var x = startX
    var y = startY
    let maxVenture = 80
    var curTry = 0
    var prevPos = -1
    var prevDirection = DOWN
    let blackLim = 200
    let PX = 1
    while true {
      curTry += 1
      if curTry > maxVenture {
        print("max venture")
        break
      }
      if curTry > 1 && x == startX && y == startY {
        debug("back at begin")
        break
      }
      let curPos = y * perRow + x
      var rightBlack = false
      var downBlack = false
      var leftBlack = false
      var upBlack = false
      // left
      let leftIndex = y * perRow + x - PX
      if prevPos != leftIndex && buffer[leftIndex] < blackLim {
        leftBlack = true
        if x - PX < startPoint[0] {
          curTry = 0
          prevDirection = LEFT
          x -= PX
          startPoint[0] = x
          prevPos = curPos
          debug("left one")
          continue
        }
      }
      // up
      let upIndex = (y - 2 * PX) * perRow + x
      if prevPos != upIndex && buffer[upIndex] < blackLim {
        upBlack = true
        if y - 2 * PX < startPoint[1] {
          curTry = 0
          prevDirection = UP
          y -= 2 * PX
          startPoint[1] = y
          prevPos = curPos
          debug("up one")
          continue
        }
      }
      // right
      let rightIndex = y * perRow + x + PX
      if prevPos != rightIndex && buffer[rightIndex] < blackLim {
        rightBlack = true
        if x + PX > endPoint[0] {
          curTry = 0
          prevDirection = RIGHT
          x += PX
          endPoint[0] = x
          prevPos = curPos
          debug("right one")
          continue
        }
      }
      // down
      let downIndex = (y + PX) * perRow + x
      if prevPos != downIndex && buffer[downIndex] < blackLim {
        downBlack = true
        if y + PX > endPoint[1] && !rightBlack {
          curTry = 0
          prevDirection = DOWN
          y += PX
          endPoint[1] = y
          prevPos = curPos
          debug("down one")
          continue
        }
      }
      prevPos = curPos
      // didnt expand the bounds
      // still need to move the current
      if prevDirection == LEFT {
        if downBlack {
          debug("move down")
          prevDirection = DOWN
          y += PX
        } else if leftBlack {
          debug("move left")
          prevDirection = LEFT
          x -= PX
        } else if upBlack {
          debug("move up")
          prevDirection = UP
          y -= PX
        } else {
          // back right
          debug("move back right")
          prevDirection = RIGHT
          x += PX
        }
      }
      if prevDirection == UP {
        if leftBlack {
          debug("move left")
          prevDirection = LEFT
          x -= PX
        } else if upBlack {
          debug("move up")
          prevDirection = UP
          y -= PX
        } else if rightBlack {
          debug("move right")
          prevDirection = RIGHT
          x += PX
        } else {
          // back down
          debug("move back down")
          prevDirection = DOWN
          y += PX
        }
      }
      if prevDirection == RIGHT {
        if upBlack {
          debug("move up")
          prevDirection = UP
          y -= PX
        } else if rightBlack {
          debug("move right")
          prevDirection = RIGHT
          x += PX
        } else if downBlack {
          debug("move down")
          prevDirection = DOWN
          y += PX
        } else {
          // back left
          debug("move back left")
          prevDirection = LEFT
          x -= PX
        }
      }
      if prevDirection == DOWN {
        if rightBlack {
          debug("move right")
          prevDirection = RIGHT
          x += PX
        } else if downBlack {
          debug("move down")
          prevDirection = DOWN
          y += PX
        } else if leftBlack {
          debug("move left")
          prevDirection = LEFT
          x -= PX
        } else {
          // back up
          debug("move back up")
          prevDirection = UP
          y -= PX
        }
      }
    }

    return [startPoint[0], startPoint[1], endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
  }

  public func charsToString(rects: [[Int]], debugID: Int) -> String {
    //    let start = DispatchTime.now()
    var output = ""
    let dbl = Float(28)
    for (index, rect) in rects.enumerated() {
      let minX = rect[0]
      let minY = rect[1]
      if rect[3] == 0 || rect[2] == 0 {
        print("empty char")
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
          let lumaVal = luma < 200 ? "0 " : "255 " // warning, doing any sort of string conversion here slows it down bigly
          output += lumaVal
          if debugID > -1 {
            pixels!.append(PixelData(a: 255, r: luma, g: luma, b: luma))
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

