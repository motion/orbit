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

  init(data: UnsafeMutablePointer<UInt8>, perRow: Int, maxLuma: Int, debug: Bool, debugDir: String?, debugImg: CGImage?) {
    self.maxLuma = maxLuma // higher == allow lighter
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
//      self.shouldDebug = id == 0 && curChar == 0
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
      let isBlack = luma < maxLuma ? true : false
      if shouldDebug {
        let val = UInt8(isBlack ? 0 : 255)
        pixels![x + y * imgW] = PixelData(a: 255, r: val, g: val, b: val)
      }
      if isBlack {
        if shouldDebug && debugImg != nil {
          // todo need to handle frame offset here
          let box = CGRect(x: xO / 2, y: yO / 2, width: 50, height: 50)
          images.writeCGImage(image: images.cropImage(debugImg!, box: box)!, to: "/tmp/screen/view\(id)-\(curChar).png")
        }
        let cb = self.findCharacter(
          startX: xO,
          startY: yO,
          maxHeight: imgH * 2
        )
        if cb[3] == 0 || cb[2] == 0 {
          print("0 size")
        } else {
          let tooSmall = cb[2] < 5 && cb[3] < 5 || cb[2] < 2 || cb[3] < 2
          let tooWide = cb[3] / cb[2] > 10
          let tooTall = cb[2] / cb[3] > 20
          let misfit = tooSmall || tooWide || tooTall
          if shouldDebug && debugImg != nil {
            if let img = images.cropImage(debugImg!, box: CGRect(x: cb[0] / 2, y: cb[1] / 2, width: cb[2] / 2, height: cb[3] / 2)) {
              images.writeCGImage(image: img, to: "/tmp/screen/\(misfit ? "fitmiss-" : "fit")-\(id)-\(curChar).png")
            }
          }
          if misfit {
            print("misfit \(cb)")
            x += 2
            y = 0
            continue
          } else {
            foundChars.append(cb)
          }
          // done w new char
          debug("x \(x) \(cb)")
          x = cb[4] / 2 + 1  // add endX
          y = 0
          curChar += 1
        }
      }
    }
    if pixels != nil && pixels!.count > 0 && debugImg != nil {
      if let img = images.imageFromArray(pixels: pixels!, width: imgW, height: imgH) {
        Images().writeCGImage(image: img, to: "/tmp/screen/edge\(id).png", resolution: 72) // write img
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
  
  func findCharacter(startX: Int, startY: Int, maxHeight: Int) -> [Int] {
    let exaust = 450 // most amount to go without finding new bound before give up
    var visited = Dictionary<Int, Bool?>()
    var startPoint = [startX, startY] // top left point
    var endPoint = [startX, startY] // bottom right point
    // start going down as we came
    var lastMove = [0, 1]
    var x = startX
    var y = startY - 1
    var curTry = 0
    var curPos = 0
    func move(_ dir: [Int]) -> Int {
      return curPos + dir[0] + dir[1] * perRow
    }
    func isBlack(_ pos: Int) -> Bool {
      return buffer[pos] < maxLuma
    }
    while true {
      curPos = y * perRow + x
      visited[curPos] = true
      curTry += 1
      if curTry > exaust { debug("max venture \(x, y)"); break }
      if curTry > 1 && x == startX && y == startY { debug("bounded"); break }
      func tryMove(_ attempt: [Int], avoidVisited: Bool, avoidBacktrack: Bool) -> Bool {
        let next = move(attempt)
        if avoidVisited && visited[next] != nil { return false }
        if !isBlack(next) { return false }
        if avoidBacktrack && attempt[0] == -lastMove[0] && attempt[1] == -lastMove[1] {
          print("backtracka avoid")
          return false
        }
        x += attempt[0]
        y += attempt[1]
        if x > endPoint[0]   { curTry = 0; endPoint[0] = x }
        if x < startPoint[0] { curTry = 0; startPoint[0] = x }
        if y > endPoint[1]   { curTry = 0; endPoint[1] = y }
        if y < startPoint[1] { curTry = 0; startPoint[1] = y }
        return true
      }
      var success = false
      for avoidVisited in [true, false] {
        for attempt in moves.clockwise[lastMove[0]]![lastMove[1]]! {
          if tryMove(attempt, avoidVisited: avoidVisited, avoidBacktrack: true) {
            lastMove = attempt
            success = true
            break
          }
        }
        if !success {
          // expand radius y
          for attempt in moves.clockwise[lastMove[0]]![lastMove[1]]! {
            let bigAttempt = [attempt[0], attempt[1] * 2]
            if tryMove(bigAttempt, avoidVisited: avoidVisited, avoidBacktrack: true) {
              lastMove = attempt
              success = true
              break
            }
          }
        }
        if success {
          break
        }
      }
    }
    let diff = startX - startPoint[0]
    var backmoves = 0
    if diff > 0 {
      backmoves += diff
    }
    return [
      startPoint[0], // x
      startPoint[1], // y
      endPoint[0] - startPoint[0], // width
      endPoint[1] - startPoint[1], // height
      endPoint[0] - backmoves, // endX
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
      if shouldDebug {
        pixels = [PixelData]()
      }
      for y in 0..<28 {
        for x in 0..<28 {
          let xS = Int(Float(x) * scaleX)
          let yS = Int(Float(y) * scaleY)
          let luma = buffer[(minY + yS) * perRow + minX + xS]
          let lumaVal = luma < 150 ? "0 " : "255 " // warning, doing any sort of string conversion here slows it down bigly
          output += lumaVal
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
    //    print(".. char => string: \(rects.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return output
  }
}

