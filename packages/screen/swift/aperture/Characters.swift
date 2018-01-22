import AppKit

class Characters {
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  
  init(data: UnsafeMutablePointer<UInt8>, perRow: Int) {
    self.buffer = data
    self.perRow = perRow
  }
  
  func find(id: Int, bounds: [Int]) -> [CGRect] {
    if id != 18 {
      // hn line 18 is a good test
      return []
    }
    let start = DispatchTime.now()
    let imgX = bounds[0] * 2
    let imgY = bounds[1] * 2
    let imgW = bounds[2]
    let imgH = bounds[3]
    var pixels = [PixelData]() // write img
    var characters = [(x: Int, y: Int, w: Int, h: Int)]()
    var cur = 0
    
    print("\(imgX) \(imgY) \(imgW) \(imgH)")
    for y in stride(from: imgY, to: imgY + imgH * 2, by: 2) {
      for x in stride(from: imgX, to: imgX + imgW * 2, by: 2) {
        let luma = buffer[y * perRow + x]
        let isBlack = luma < 200 ? true : false
        
        if isBlack {
          self.findCharacter(startX: x, startY: y)
        }
        
        let binarized = UInt8(isBlack ? 0 : 255)
        pixels.append(PixelData(a: 255, r: binarized, g: binarized, b: binarized))
      }
    }
    Images().writeCGImage(image: images.imageFromArray(pixels: pixels, width: imgW, height: imgH)!, to: "/tmp/screen/a-line-\(id).png", resolution: 72) // write img
    
    print("  Characters.find(): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return []
  }
  
  func findCharacter(startX: Int, startY: Int) {
    var startX = startX
    var startY = startY
    var endX = startX
    var endY = startY
    
    
  }
}

