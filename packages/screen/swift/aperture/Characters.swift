import AppKit

class Characters {
  var shouldDebug = false

  private let images = Images()
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  private var debugImg: CGImage? = nil
  private var debugDir = ""
  private var maxLuma = 0
  private let moves = Moves()
  private let specialDebug = [0, 0]
  private var curChar = 0
  private var id = 0
  private var frameOffset: [Int]

  func sdebug() -> Bool {
    return shouldDebug && specialDebug[0] == id && specialDebug[1] == curChar
  }

  init(data: UnsafeMutablePointer<UInt8>, perRow: Int, maxLuma: Int, frameOffset: [Int], debug: Bool, debugDir: String?, debugImg: CGImage?) {
    self.maxLuma = maxLuma // higher == allow lighter
    self.shouldDebug = debug
    self.buffer = data
    self.perRow = perRow
    self.debugDir = debugDir ?? ""
    self.debugImg = debugImg
    self.frameOffset = frameOffset
  }

  func find(id: Int, bounds: [Int]) -> [[Int]] {
    let start = DispatchTime.now()
    let lineX = bounds[0] * 2
    let lineY = bounds[1] * 2
    let lineW = bounds[2]
    let lineH = bounds[3]
    var foundChars = [[Int]]()
    var pixels: [PixelData]? = nil
    self.id = id
    self.curChar = 0
    // we control the sticks for more speed
    var x = 0
    var y = 0
    let maxHeightCheck = lineH - lineH / 2
    while true {
      if shouldDebug && pixels == nil && debugImg != nil {
        pixels = [PixelData](repeating: PixelData(a: 255, r: 255, g: 255, b: 255), count: lineW * lineH)
      }
      // this first loop can be pretty inaccurate, as long as it finds a good pixel
      if y == lineH - 1 {
        x += 1
        y = 0
      } else {
        y += lineH / 5 // x checks per line
      }
      // no need to go all the way down
      if y > maxHeightCheck {
        x += 1
        y = 0
        continue
      }
      // if reached last pixel, break
      if x >= lineW || y >= lineH || (x == lineW - 1 && y == lineH - 1) {
        break
      }
      let xO = x * 2 + lineX
      // rewind to topmost filled px if we passed it
      while true { if buffer[((y - 1) * 2 + lineY) * perRow + xO] < maxLuma { y -= 1 } else { break } }
      let yO = y * 2 + lineY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < maxLuma ? true : false
      if shouldDebug {
        let val = UInt8(isBlack ? 0 : 255)
        pixels![x + y * lineW] = PixelData(a: 255, r: val, g: val, b: val)
      }
      if isBlack {
//        if shouldDebug && debugImg != nil {
          // this just helps to debug if you are cropping wrong somewhere else
//          let box = CGRect(x: xO / 2, y: yO / 2, width: 50, height: 50)
//          images.writeCGImage(image: images.cropImage(debugImg!, box: box)!, to: "/tmp/screen/view\(id)-\(curChar).png")
//        }
        let cb = self.findCharacter(
          startX: xO,
          startY: yO,
          maxHeight: lineH * 2
        )
        if cb[3] == 0 || cb[2] == 0 {
          debug("0 size")
        } else {
          let tooSmall = cb[2] < 5 && cb[3] < 5 || cb[2] < 2 || cb[3] < 2
          let tooThin = cb[3] / cb[2] > 25
          let tooWide = cb[2] / cb[3] > 25
          let misfit = tooSmall || tooThin || tooWide
          if shouldDebug && debugImg != nil {
            let box = CGRect(x: cb[0] / 2 - frameOffset[0] * 2, y: cb[1] / 2 - frameOffset[1] * 2, width: cb[2] / 2, height: cb[3] / 2)
            if let img = images.cropImage(debugImg!, box: box) {
              images.writeCGImage(image: img, to: "/tmp/screen/\(misfit ? "charmiss-" : "char")\(id)-\(curChar).png")
            }
          }
          y = 0
          if misfit {
            debug("misfit \(cb)")
            x += 2
            continue
          } else {
            foundChars.append(cb)
          }
          // width - backtracks + 2
          let fwd = (cb[2] / 2 - cb[4] / 2 + 2)
          let nextX = x + fwd
          debug("move: \(x) fwd \(fwd) [w \(cb[2]) back \(cb[4])]")
          if nextX < x {
            x += 2
          } else {
            x = nextX
          }
          debug("   => \(x)")
          curChar += 1
        } // end if
      } // end if
    } // end while
    if pixels != nil && pixels!.count > 0 && debugImg != nil {
      if let img = images.imageFromArray(pixels: pixels!, width: lineW, height: lineH) {
        Images().writeCGImage(image: img, to: "/tmp/screen/hit\(id).png", resolution: 72) // write img
      }
    }
    debug("Characters.find() \(foundChars.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return foundChars
  }

  func debug(_ str: String) {
    if shouldDebug {
      print(str)
    }
  }

  func isBlack(_ pos: Int) -> Bool {
    return buffer[pos] < maxLuma
  }

  func findCharacter(startX: Int, startY: Int, maxHeight: Int) -> [Int] {
    let exhaust = maxHeight / 2 / moves.px // most amount to go without finding new bound before give up
    var visited = Dictionary<Int, Bool?>() // for preventing crossing over at thin interections
    var topLeftBound = [startX, startY]
    var bottomRightBound = [startX, startY]
    var lastMove = [0, moves.px] // we begin going down
    var x = startX
    var y = startY - moves.px // and one above where we found the first black px
    var curTry = 0
    var curPos = 0
    var foundEnd = false
    let clockwise = moves.clockwise
    while !foundEnd {
      curPos = y * perRow + x
      visited[curPos] = true
      curTry += 1
      if curTry > exhaust {
//        debug("exhausted")
        foundEnd = true
        break
      }
      var success = false
      for attempt in clockwise[lastMove[0]]![lastMove[1]]! {
        let next = curPos + attempt[0] + attempt[1] * perRow
        if curTry > 10 && x == startX && y == startY {
//          debug("found end")
          foundEnd = true
          break
        }
        // not black
        if buffer[next] >= maxLuma { continue }
        // already visited
        if visited[next] != nil { continue }
        // found a valid next move
        success = true
        // update pos
        x += attempt[0]
        y += attempt[1]
        // update bounds
        let newEndX = x > bottomRightBound[0]
        let newStartX = x < topLeftBound[0]
        let newStartY = y < topLeftBound[1]
        let newEndY = y > bottomRightBound[1]
        if newEndX { curTry = 0; bottomRightBound[0] = x }
        else if newStartX { curTry = 0; topLeftBound[0] = x }
        if newStartY { curTry = 0; topLeftBound[1] = y }
        else if newEndY { curTry = 0; bottomRightBound[1] = y }
//        if sdebug() && curTry == 0 {
//          if newEndX { print("new endX \(x / 2)") }
//          if newStartX { print("new startX \(x / 2)") }
//          if newStartY { print("new startY \(y / 2)") }
//          if newEndY { print("new endY \(y / 2)") }
//        }
        // update move
        if attempt.count == 3 {
          if attempt[2] == 1 { // big x
              lastMove = [attempt[0] / 2, attempt[1]]
            } else { // big y
              lastMove = [attempt[0], attempt[1] / 2]
            }
        } else {
          lastMove = attempt
        }
//        if sdebug() {
//          let xdir = lastMove[0] == -1 ? "left" : lastMove[0] == 0 ? "   " : "right"
//          let ydir = lastMove[1] == -1 ? "up  " : lastMove[1] == 0 ? "   " : "down"
//          print(" .. \(xdir) \(ydir) | \(lastMove[0]) \(lastMove[1]) | attempt \(index)")
//        }
        break
      }
      if !success {
        break
      }
    }
    return [
      topLeftBound[0], // x
      topLeftBound[1], // y
      bottomRightBound[0] - topLeftBound[0] + 2, // width
      bottomRightBound[1] - topLeftBound[1] + 2, // height
      startX - topLeftBound[0], // backwards moves
    ]
  }

  public func charsToString(rects: [[Int]], debugID: Int) -> String {
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
      if shouldDebug {
        pixels = [PixelData]()
      }
      for y in 0..<28 {
        for x in 0..<28 {
          let xS = Int(Float(x) * scaleX)
          let yS = Int(Float(y) * scaleY)
          let luma = buffer[(minY + yS) * perRow + minX + xS]
          // luminance to intensity means we have to inverse it
          // warning, doing any sort of Int => String conversion here slows it down Bigly
          if luma < 50 { // white
            output += "0.2 "
          } else if luma < 100 {
            output += "0.4 "
          } else if luma < 150 {
            output += "0.6 "
          } else if luma < 200 {
            output += "0.8 "
          } else {  // black
            output += "1.0 "
          }
          if shouldDebug {
            let brt = UInt8(luma < self.maxLuma ? 0 : 255)
            pixels!.append(PixelData(a: 255, r: brt, g: brt, b: brt))
          }
        }
      }
      output += "\n"
      if shouldDebug {
        let outFile = "\(debugDir)/xa\(debugID)-\(index).png"
        images.writeCGImage(image: images.imageFromArray(pixels: pixels!, width: 28, height: 28)!, to: outFile, resolution: 72) // write img
      }
    }
    return output
  }
}

