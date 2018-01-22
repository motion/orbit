import AppKit

class Characters {
  internal func find(id: Int, data: UnsafeMutablePointer<UInt8>, perRow: Int, bounds: [Int]) -> [CGRect] {
    if id != 18 {
      // hn line 18 is a good test
      return []
    }
    let start = DispatchTime.now()
    let yScale = perRow
    let imgX = bounds[0] * 2
    let imgY = bounds[1] * 2
    let imgW = bounds[2]
    let imgH = bounds[3]
    var pixels = [PixelData]() // write img
    print("\(imgX) \(imgY) \(imgW) \(imgH)")
    for y in stride(from: imgY, to: imgY + imgH * 2, by: 2) {
      for x in stride(from: imgX, to: imgX + imgW * 2, by: 2) {
        let luma = data[y * yScale + x] // 2155643004 == pure white
        pixels.append(PixelData(a: 255, r: luma, g: luma, b: luma))
      }
    }
    Images().writeCGImage(image: images.imageFromArray(pixels: pixels, width: imgW, height: imgH)!, to: "/tmp/screen/a-line-\(id).png", resolution: 72) // write img
    
    print("  Characters.find(): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return []
  }
}

