import AppKit

class Characters {
  private let images = Images()
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  private var shouldDebug = false
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
    let maxHeightCheck = imgH - imgH / 4
    while true {
      self.shouldDebug = id == 0 && curChar == 0
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
      let isBlack = luma < maxLuma ? true : false
      if shouldDebug && debugImg != nil {
        let val = UInt8(isBlack ? 0 : 255)
        pixels![x + y * imgW] = PixelData(a: 255, r: val, g: val, b: val)
      }
      if isBlack {
        if shouldDebug && debugImg != nil {
          // todo need to handle frame offset here
          let box = CGRect(x: xO / 2, y: yO / 2, width: 50, height: 50)
          let charImgIn = images.cropImage(debugImg!, box: box)
          images.writeCGImage(image: charImgIn, to: "/tmp/screen/testinline-\(id)-char-\(curChar).png")
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
          if tooSmall || tooWide || tooTall {
            print("misfit \(cb)")
          } else {
            foundChars.append(cb)
            if shouldDebug && debugImg != nil {
              print("crop \(cb)")
              images.writeCGImage(image: images.cropImage(debugImg!, box: CGRect(x: cb[0] / 2, y: cb[1] / 2, width: cb[2] / 2, height: cb[3] / 2)), to: "/tmp/screen/testchar-\(id)-\(curChar).png")
            }
          }
          // after processing new char, move x to end of char
          x += cb[2] / 2 + 1
          y = 0
          curChar += 1
        }
      }
    }
    if shouldDebug && debugImg != nil {
      if let img = images.imageFromArray(pixels: pixels!, width: imgW, height: imgH) {
        Images().writeCGImage(image: img, to: "/tmp/screen/edgehits-\(id).png", resolution: 72) // write img
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
    var visited = Dictionary<Int, Bool?>()
    var startPoint = [startX, startY] // top left point
    var endPoint = [startX, startY] // bottom right point
    var x = startX
    var y = startY - 1
    let maxVenture = 250 // most amount to go without finding new bound before give up
    var curTry = 0
    var lastMove = [0, 1] // start going down
    while true {
      curTry += 1
      if curTry > maxVenture {
        debug("max venture")
        break
      }
      if curTry > 1 && x == startX && y == startY {
        debug("back at begin")
        break
      }
      var curPos = y * perRow + x
      visited[curPos] = true
      func move(_ dir: [Int]) -> Int {
        return curPos + dir[0] + dir[1] * perRow
      }
      func isBlack(_ pos: Int) -> Bool {
        return buffer[pos] < maxLuma
      }
      for attempt in moves.clockwise[lastMove[0]]![lastMove[1]]! {
        let next = move(attempt)
        if visited[next] != nil { continue }
        if !isBlack(next) { continue }
        lastMove = attempt
        x += attempt[0]
        y += attempt[1]
        if x > endPoint[0] { endPoint[0] = x }
        if x < startPoint[0] { startPoint[0] = x }
        if y > endPoint[1] { endPoint[1] = y }
        if y < startPoint[1] { startPoint[1] = y }
      }
    }
    return [
      startPoint[0],
      startPoint[1],
      endPoint[0] - startPoint[0],
      endPoint[1] - startPoint[1]
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
      if shouldDebug && debugID > -1 {
        pixels = [PixelData]()
      }
      for y in 0..<28 {
        for x in 0..<28 {
          let xS = Int(Float(x) * scaleX)
          let yS = Int(Float(y) * scaleY)
          let luma = buffer[(minY + yS) * perRow + minX + xS]
          let lumaVal = luma < 150 ? "0 " : "255 " // warning, doing any sort of string conversion here slows it down bigly
          output += lumaVal
          if shouldDebug && debugID > -1 {
            let brt = UInt8(luma < self.maxLuma ? 0 : 255)
            pixels!.append(PixelData(a: 255, r: brt, g: brt, b: brt))
          }
        }
      }
      output += "\n"
      if shouldDebug && debugID > -1 {
        let outFile = "\(debugDir)/x-line-\(debugID)-char-\(index).png"
        images.writeCGImage(image: images.imageFromArray(pixels: pixels!, width: 28, height: 28)!, to: outFile, resolution: 72) // write img
      }
    }
    //    print(".. char => string: \(rects.count) \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return output
  }
}

