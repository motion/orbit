import AppKit

class Characters {
  private let images = Images()
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  private var shouldDebug = false
  
  init(data: UnsafeMutablePointer<UInt8>, perRow: Int, debug: Bool) {
    self.shouldDebug = debug
    self.buffer = data
    self.perRow = perRow
  }
  
  func find(id: Int, bounds: [Int], debugImg: CGImage) -> [[Int]] {
//    let start = DispatchTime.now()
    let imgX = bounds[0] * 2
    let imgY = bounds[1] * 2
    let imgW = bounds[2]
    let imgH = bounds[3]
    var foundChars = [[Int]]()
//    var pixels = [PixelData](repeating: PixelData(a: 255, r: 0, g: 0, b: 0), count: imgW * imgH)
    var curChar = 0

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
      // if reached last pixel break
      if x >= imgW || y >= imgH || (x == imgW - 1 && y == imgH - 1) {
        break
      }
      // loop logic
      let xO = x * 2 + imgX
      let yO = y * 2 + imgY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < 200 ? true : false
//      let binarized = UInt8(isBlack ? 0 : 255)
//      pixels[x + y * imgW] = PixelData(a: 255, r: binarized, g: binarized, b: binarized)
      if isBlack {
//        let charImgIn = images.cropImage(debugImg, box: CGRect(x: xO, y: yO - 24 * 2, width: 25, height: 25))
//        images.writeCGImage(image: charImgIn, to: "/tmp/screen/a-line-\(id)-charIN-\(curChar).png")
        let cb = self.findCharacter(startX: xO, startY: yO)
        foundChars.append(cb)
//        print("char bounds \(cb) and were at \(x)")
//        images.writeCGImage(image: images.cropImage(debugImg, box: CGRect(x: cb[0], y: cb[1] - 24 * 2, width: cb[2] + 100, height: cb[3] + 100)), to: "/tmp/screen/char-\(id)-\(curChar).png")
        // after processing new char, move x to end of char
        x += cb[2] / 2 + 1
        y = 0
        curChar += 1
      }
    }

//    print("ok \(pixels.count) \(imgW * imgH)  imgW \(imgW) imgH \(imgH)")
//    if let img = images.imageFromArray(pixels: pixels, width: imgW, height: imgH) {
//      Images().writeCGImage(image: img, to: "/tmp/screen/a-line-\(id).png", resolution: 72) // write img
//    }
    
//    print("  Characters.find() \(foundChars.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
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
//    print("finding character at \(startX) \(startY)")
    var hasClosedChar = false
    var startPoint = [startX, startY] // top left point
    var endPoint = [startX, startY] // bottom right point
//    var hasSeen = Dictionary<Int, Bool>()
    var x = startX
    var y = startY
    let maxTries = 250
    var curTry = 0
    var prevPos = -1
    var prevDirection = DOWN
    let blackLim = 200
    let PX = 1
    
    while !hasClosedChar {
      curTry += 1
      if curTry > maxTries {
        debug("done trying")
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
            prevDirection = LEFT
            x -= PX
            startPoint[0] = x
            prevPos = curPos
            debug("left one")
            continue
          }
//        }
      }
      // up
      let upIndex = (y - PX) * perRow + x
      if prevPos != upIndex && buffer[upIndex] < blackLim {
        upBlack = true
        if y - PX < startPoint[1] {
          prevDirection = UP
          y -= PX
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
        if y + PX > endPoint[1] {
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
          y += PX
        } else if leftBlack {
          debug("move left")
          x -= PX
        } else if upBlack {
          debug("move up")
          y -= PX
        } else {
          // back right
          prevDirection = RIGHT
          x += PX
        }
      }
      if prevDirection == UP {
        if leftBlack {
          debug("move left")
          x -= PX
        } else if upBlack {
          debug("move up")
          y -= PX
        } else if rightBlack {
          debug("move right")
          x += PX
        } else {
          // back down
          prevDirection = DOWN
          y += PX
        }
      }
      if prevDirection == RIGHT {
        if upBlack {
          debug("move up")
          y -= PX
        } else if rightBlack {
          debug("move right")
          x += PX
        } else if downBlack {
          debug("move down")
          y += PX
        } else {
          // back left
          prevDirection = LEFT
          x -= PX
        }
      }
      if prevDirection == DOWN {
        if rightBlack {
          debug("move right")
          x += PX
        } else if downBlack {
          debug("move down")
          y += PX
        } else if leftBlack {
          debug("move left")
          x -= PX
        } else {
          // back up
          prevDirection = UP
          y -= PX
        }
      }
    }
    
    return [startPoint[0], startPoint[1], endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
  }
  
  public func charsToString(rects: [[Int]], debugDir: String?, lineNum: Int?) -> String {
    //    let start = DispatchTime.now()
    var output = ""
    let dbl = Float(28)
    for (index, rect) in rects.enumerated() {
      let minX = rect[0]
      let minY = rect[1]
      let width = Float(rect[2])
      let height = Float(rect[3])
      print("\(height) \(width)")
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
      scaleW = 1 / scaleW
      scaleH = 1 / scaleH
      print("scale \(scaleW) \(scaleH)")
      var pixels = [PixelData]() // write img
      for y in 0..<28 {
        for x in 0..<28 {
          let xS = Int(Float(x) * scaleW)
          let yS = Int(Float(y) * scaleH)
          let luma = buffer[(minY + yS) * perRow + minX + xS]
          let lumaVal = luma < 200 ? "0 " : "255 " // warning, doing any sort of string conversion here slows it down bigly
          output += lumaVal
          if debugDir != nil {
            pixels.append(PixelData(a: 255, r: luma, g: luma, b: luma))
          }
        }
      }
      output += "\n"
      if debugDir != nil {
        let outFile = "\(debugDir!)/x-line-\(lineNum!)-char-\(index).png"
        print("write \(outFile)")
        images.writeCGImage(image: images.imageFromArray(pixels: pixels, width: 28, height: 28)!, to: outFile, resolution: 72) // write img
      }
    }
    //    print(".. char => string: \(rects.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return output
  }
}

