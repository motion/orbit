import AppKit

class Characters {
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  
  init(data: UnsafeMutablePointer<UInt8>, perRow: Int) {
    self.buffer = data
    self.perRow = perRow
  }
  
  func find(id: Int, bounds: [Int], debugImg: CGImage) -> [CGRect] {
    if id != 18 {
      // hn line 18 is a good test
      return []
    }
    let start = DispatchTime.now()
    let imgX = bounds[0] * 2
    let imgY = bounds[1] * 2
    let imgW = bounds[2]
    let imgH = bounds[3]
    var pixels = [PixelData](repeating: PixelData(a: 255, r: 0, g: 0, b: 0), count: imgW * imgH)
    print("ccccc \(imgW * imgH) \(pixels.count)")
    var curChar = 0
    
    print("\(imgX) \(imgY) \(imgW) \(imgH)")
    // stride(from: imgX, to: imgX + imgW * 2, by: 2)
    // stride(from: imgY, to: imgY + imgH * 2, by: 2)
    for x in 0..<imgW {
      for y in 0..<imgH {
        let xO = x * 2 + imgX
        let yO = y * 2 + imgY
        let luma = buffer[yO * perRow + xO]
        let isBlack = luma < 200 ? true : false

        if curChar == 0 && isBlack {
          let cb = self.findCharacter(startX: xO, startY: yO)
          print("char bounds \(cb)")
          let charImg = images.cropImage(debugImg, box: CGRect(x: cb[0] - bounds[0], y: cb[1] - 24 * 2, width: 100, height: 100))
          images.writeCGImage(image: charImg, to: "/tmp/screen/a-line-\(id)-char-\(curChar).png")
          curChar += 1
        }
        
        let binarized = UInt8(isBlack ? 0 : 255)
        pixels[x + y * imgW] = PixelData(a: 255, r: binarized, g: binarized, b: binarized)
      }
    }
    print("ok \(pixels.count) \(imgW * imgH)  imgW \(imgW) imgH \(imgH)")
    Images().writeCGImage(image: images.imageFromArray(pixels: pixels, width: imgW, height: imgH)!, to: "/tmp/screen/a-line-\(id).png", resolution: 72) // write img
    
    print("  Characters.find(): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return []
  }
  
  func findCharacter(startX: Int, startY: Int) -> [Int] {
    print("finding character at \(startX) \(startY)")
    var hasClosedChar = false
    var startPoint = [startX, startY] // top left point
    var endPoint = [startX, startY] // bottom right point
    var x = startX
    var y = startY
    var maxTries = 500
    var curTry = 0
    
    while !hasClosedChar {
      curTry += 1
      if curTry > maxTries {
        print("done trying")
        break
      }
      var rightBlack = false
      var downBlack = false
      var leftBlack = false
      var upBlack = false
      // up
      if buffer[(y - 2) * perRow + x] < 200 {
        upBlack = true
        if y - 2 < startPoint[1] {
          y = y - 2
          startPoint[1] = y
          print("up one")
          continue
        }
      }
      // right
      if buffer[y * perRow + x + 2] < 200 {
        rightBlack = true
        if x + 2 > endPoint[0] {
          x = x + 2
          endPoint[0] = x
          print("right one")
          continue
        }
      }
      // down
      if buffer[(y + 2) * perRow + x] < 200 {
        downBlack = true
        if y + 2 > endPoint[1] {
          y = y + 2
          endPoint[1] = y
          print("down one")
          continue
        }
      }
      // left
      if buffer[y * perRow + x - 2] < 200 {
        leftBlack = true
        if x - 2 < startPoint[0] {
          x = x - 2
          startPoint[0] = x
          print("up one")
          continue
        }
      }
      // didnt expand the bounds
      // still need to move the current
      if rightBlack {
        x = x + 2
      } else if upBlack {
        y = y - 2
      } else if downBlack {
        x = x - 2
      } else if leftBlack {
        y = y + 2
      }
    }
    
    return [startPoint[0], startPoint[1], endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]]
  }
}

