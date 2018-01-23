import AppKit

class Characters {
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  
  init(data: UnsafeMutablePointer<UInt8>, perRow: Int) {
    self.buffer = data
    self.perRow = perRow
  }
  
  func find(id: Int, bounds: [Int], debugImg: CGImage) -> [[Int]] {
    let start = DispatchTime.now()
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
//        let charImg = images.cropImage(debugImg, box: CGRect(x: cb[0], y: cb[1] - 24 * 2, width: cb[2], height: cb[3]))
//        images.writeCGImage(image: charImg, to: "/tmp/screen/a-line-\(id)-char-\(curChar).png")
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
    
    print("  Characters.find() \(foundChars.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return foundChars
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
    let maxTries = 150
    var curTry = 0
    var prevPos = -1
    var prevDirection = DOWN
    let blackLim = 200
    let PX = 1
    
    while !hasClosedChar {
      curTry += 1
      if curTry > maxTries {
//        print("done trying")
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
//            print("left one")
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
//          print("up one")
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
//          print("right one")
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
//          print("down one")
          continue
        }
      }
      prevPos = curPos
      // didnt expand the bounds
      // still need to move the current
      if prevDirection == LEFT {
        if downBlack {
//          print("move down")
          y += PX
        } else if leftBlack {
//          print("move left")
          x -= PX
        } else if upBlack {
//          print("move up")
          y -= PX
        } else {
          // back right
          prevDirection = RIGHT
          x += PX
        }
      }
      if prevDirection == UP {
        if leftBlack {
//          print("move left")
          x -= PX
        } else if upBlack {
//          print("move up")
          y -= PX
        } else if rightBlack {
//          print("move right")
          x += PX
        } else {
          // back down
          prevDirection = DOWN
          y += PX
        }
      }
      if prevDirection == RIGHT {
        if upBlack {
//          print("move up")
          y -= PX
        } else if rightBlack {
//          print("move right")
          x += PX
        } else if downBlack {
//          print("move down")
          y += PX
        } else {
          // back left
          prevDirection = LEFT
          x -= PX
        }
      }
      if prevDirection == DOWN {
        if rightBlack {
//          print("move right")
          x += PX
        } else if downBlack {
//          print("move down")
          y += PX
        } else if leftBlack {
//          print("move left")
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
}

