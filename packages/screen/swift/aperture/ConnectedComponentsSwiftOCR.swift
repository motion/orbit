import AppKit

class ConnectedComponentsSwiftOCR {
  ///Radius in x axis for merging blobs
  open      var xMergeRadius:CGFloat = 0
  ///Radius in y axis for merging blobs
  open      var yMergeRadius:CGFloat = 0

  internal func extractBlobs(lineNum: Int, bounds: [Int], bufferPointer: UnsafeMutablePointer<UInt32>, perRow: Int, frameOffset: [Int]) -> [CGRect] {
    var start = DispatchTime.now()

    let xOff = bounds[0] / 2 + frameOffset[0]
    let yOff = bounds[1] / 2 + frameOffset[1]
    let imageWidth = bounds[2]
    let imageHeight = bounds[3]
    var data = [[UInt16]](repeating: [UInt16](repeating: 0, count: imageWidth), count: imageHeight)
    let yScale = perRow / 2
    var pixels = [PixelData]() // write img
    for y in yOff..<(yOff + imageHeight) {
      for x in xOff..<(xOff + imageWidth) {
        let rawLuma = bufferPointer[y * yScale + x]
        let luma = rawLuma / 3951094656 * 255
        data[y - yOff][x - xOff] = UInt16(luma)
        let brightness = UInt8(luma)
        pixels.append(PixelData(a: 255, r: brightness, g: brightness, b: brightness))
      }
    }
    Images().writeCGImage(image: images.imageFromArray(pixels: pixels, width: imageWidth, height: imageHeight)!, to: "/tmp/screen/a-line-\(lineNum).png", resolution: 72) // write img

    // timers
    print("  extractBlobs: setup data \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()

    //MARK: First Pass

    var currentLabel:UInt16 = 0 {
      didSet {
        if currentLabel == 255 {
          currentLabel = 256
        }
      }
    }
    var labelsUnion = UnionFind<UInt16>()

    for y in 0..<imageHeight {
      for x in 0..<imageWidth {

        if data[y][x] == 0 { //Is Black
          if x == 0 { //Left no pixel
            if y == 0 { //Top no pixel
              currentLabel += 1
              labelsUnion.addSetWith(currentLabel)
              data[y][x] = currentLabel
            } else if y > 0 { //Top pixel
              if data[y - 1][x] != 255 { //Top Label
                data[y][x] = data[y - 1][x]
              } else { //Top no Label
                currentLabel += 1
                labelsUnion.addSetWith(currentLabel)
                data[y][x] = currentLabel
              }
            }
          } else { //Left pixel
            if y == 0 { //Top no pixel
              if data[y][x - 1] != 255 { //Left Label
                data[y][x] = data[y][x - 1]
              } else { //Left no Label
                currentLabel += 1
                labelsUnion.addSetWith(currentLabel)
                data[y][x] = currentLabel
              }
            } else if y > 0 { //Top pixel
              if data[y][x - 1] != 255 { //Left Label
                if data[y - 1][x] != 255 { //Top Label

                  if data[y - 1][x] != data[y][x - 1] {
                    labelsUnion.unionSetsContaining(data[y - 1][x], and: data[y][x - 1])
                  }

                  data[y][x] = data[y - 1][x]
                } else { //Top no Label
                  data[y][x] = data[y][x - 1]
                }
              } else { //Left no Label
                if data[y - 1][x] != 255 { //Top Label
                  data[y][x] = data[y - 1][x]
                } else { //Top no Label
                  currentLabel += 1
                  labelsUnion.addSetWith(currentLabel)
                  data[y][x] = currentLabel
                }
              }
            }
          }
        }

      }
    }

    // timers
    print("  extractBlobs: first pass \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()

    //MARK: Second Pass
    let parentArray = Array(Set(labelsUnion.parent))
    var labelUnionSetOfXArray = Dictionary<UInt16, Int>()
    for label in 0..<currentLabel {
      if label != 255 {
        labelUnionSetOfXArray[label] = parentArray.index(of: labelsUnion.setOf(label) ?? 255)
      }
    }

    // timers
    print("  extractBlobs: set labels \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()

    for y in 0..<imageHeight {
      for x in 0..<imageWidth {
        let luminosity = data[y][x]
        if luminosity != 255 {
          data[y][x] = UInt16(labelUnionSetOfXArray[luminosity] ?? 255)
        }
      }
    }

    // timer
    print("  extractBlobs: gathering data \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()

    //MARK: MinX, MaxX, MinY, MaxY
    var minMaxXYLabelDict = Dictionary<UInt16, (minX: Int, maxX: Int, minY: Int, maxY: Int)>()
    for label in 0..<parentArray.count {
      minMaxXYLabelDict[UInt16(label)] = (minX: imageWidth, maxX: 0, minY: imageHeight, maxY: 0)
    }
    for y in 0..<imageHeight {
      for x in 0..<imageWidth {
        let luminosity = data[y][x]
        if luminosity != 255 {
          var value = minMaxXYLabelDict[luminosity]!
          value.minX = min(value.minX, x)
          value.maxX = max(value.maxX, x)
          value.minY = min(value.minY, y)
          value.maxY = max(value.maxY, y)
          minMaxXYLabelDict[luminosity] = value
        }
      }
    }

    // timer
    print("  extractBlobs: minmax \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()

    //MARK: Merge labels
    var mergeLabelRects = [CGRect]()
    for label in minMaxXYLabelDict.keys {
      let value = minMaxXYLabelDict[label]!
      let minX = value.minX
      let maxX = value.maxX
      let minY = value.minY
      let maxY = value.maxY
      //Filter blobs
      let minMaxCorrect = (minX < maxX && minY < maxY)
      let notToTall    = Double(maxY - minY) < Double(imageHeight) * 0.5
      let notToWide    = Double(maxX - minX) < Double(imageWidth ) * 0.5
      let notToShort   = Double(maxY - minY) > 4
      let notToThin    = Double(maxX - minX) > 4
      let notToSmall   = (maxX - minX)*(maxY - minY) > 2
      let positionIsOK = minY != 0 && minX != 0 && maxY != Int(imageHeight - 1) && maxX != Int(imageWidth - 1)
      let aspectRatio  = Double(maxX - minX) / Double(maxY - minY)
      if minMaxCorrect && notToTall && notToWide && notToShort && notToThin && notToSmall && positionIsOK &&
        aspectRatio < 1 {
        let labelRect = CGRect(x: CGFloat(CGFloat(minX) - xMergeRadius), y: CGFloat(CGFloat(minY) - yMergeRadius), width: CGFloat(CGFloat(maxX - minX) + 2*xMergeRadius + 1), height: CGFloat(CGFloat(maxY - minY) + 2*yMergeRadius + 1))
        mergeLabelRects.append(labelRect)
      } else if minMaxCorrect && notToTall && notToShort && notToThin && notToSmall && positionIsOK && aspectRatio <= 2.5 && aspectRatio >= 1 {
        let labelRect = CGRect(x: CGFloat(CGFloat(minX) - xMergeRadius), y: CGFloat(CGFloat(minY) - yMergeRadius), width: CGFloat(CGFloat(maxX - minX) + 2*xMergeRadius + 1), height: CGFloat(CGFloat(maxY - minY) + 2*yMergeRadius + 1))
        mergeLabelRects.append(labelRect)
      }
    }

    //Merge rects
    var filteredMergeLabelRects = [CGRect]()
    for rect in mergeLabelRects {
      var intersectCount = 0
      for (filteredRectIndex, filteredRect) in filteredMergeLabelRects.enumerated() {
        if rect.intersects(filteredRect) {
          intersectCount += 1
          filteredMergeLabelRects[filteredRectIndex] = filteredRect.union(rect)
        }
      }
      if intersectCount == 0 {
        filteredMergeLabelRects.append(rect)
      }
    }

    mergeLabelRects = filteredMergeLabelRects

    //Filter rects: - Not to small
    let insetMergeLabelRects = mergeLabelRects//.map({return $0.insetBy(dx: CGFloat(xMergeRadius), dy: CGFloat(yMergeRadius))})
    filteredMergeLabelRects.removeAll()
    for rect in insetMergeLabelRects {
      let widthOK  = rect.size.width  >= 3
      let heightOK = rect.size.height >= 8

      if widthOK && heightOK {
        filteredMergeLabelRects.append(rect)
      }
    }

    mergeLabelRects = filteredMergeLabelRects

//    var outputImages = [CGRect]()

    //MARK: Crop image to blob
//    for rect in mergeLabelRects {
//      if let croppedCGImage = cgImage?.cropping(to: rect) {
//        let croppedImage = NSImage(cgImage: croppedCGImage, size: rect.size)
//        outputImages.append((croppedImage, rect))
//      }
//    }
//    outputImages.sort { $0.1.origin.x < $1.1.origin.x }

    return mergeLabelRects
  }
}
