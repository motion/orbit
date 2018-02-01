import AppKit

class ConnectedComponentsSwiftOCR {
  ///Radius in x axis for merging blobs
  open      var xMergeRadius:CGFloat = 0
  ///Radius in y axis for merging blobs
  open      var yMergeRadius:CGFloat = 0

  internal func extractBlobs(_ image: CGImage, debug: Bool) -> [CGRect] {
    var start = DispatchTime.now()
    
    let imageRep = NSBitmapImageRep(cgImage: image)
    let imageWidth = imageRep.pixelsWide
    let imageHeight = imageRep.pixelsHigh
    print("width, height \(imageWidth) \(imageHeight)")

    // fill data
    var data = [[UInt16]](repeating: [UInt16](repeating: 0, count: imageWidth), count: imageHeight)
    for y in 0..<imageHeight {
      for x in 0..<imageWidth {
        let isBlack = imageRep.colorAt(x: x, y: y)!.brightnessComponent == 0.0
        data[y][x] = isBlack ? 255 : 0 // invert
      }
    }

    print("  extractBlobs: setup data \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    start = DispatchTime.now()

    //MARK: First Pass
    var currentLabel:UInt16 = 256
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
    if debug { print("  extractBlobs: first pass \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms"); start = DispatchTime.now() }

    //MARK: Second Pass
    let parentArray = Array(Set(labelsUnion.parent))
    var labelUnionSetOfXArray = Dictionary<UInt16, Int>()
    for label in 0..<currentLabel {
      if label != 255 {
        labelUnionSetOfXArray[label] = parentArray.index(of: labelsUnion.setOf(label) ?? 255)
      }
    }

    // timers
    if debug { print("  extractBlobs: set labels \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms"); start = DispatchTime.now() }

    var minMaxXYLabelDict = Dictionary<UInt16, (minX: Int, maxX: Int, minY: Int, maxY: Int)>()
    for label in 0..<parentArray.count {
      minMaxXYLabelDict[UInt16(label)] = (minX: imageWidth, maxX: 0, minY: imageHeight, maxY: 0)
    }
    
    for y in 0..<imageHeight {
      for x in 0..<imageWidth {
        var luminosity = data[y][x]
        if luminosity != 255 {
          luminosity = UInt16(labelUnionSetOfXArray[luminosity] ?? 255)
          data[y][x] = luminosity
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
    }

    // timer
    if debug { print("  extractBlobs: minmax \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms"); start = DispatchTime.now() }
    
    // rest is fast

    //MARK: Merge labels
    var mergeLabelRects = [CGRect]()
    for label in minMaxXYLabelDict.keys {
      let value = minMaxXYLabelDict[label]!
      let minX = value.minX
      let maxX = value.maxX
      let minY = value.minY
      let maxY = value.maxY
      let labelRect = CGRect(
        x: CGFloat(CGFloat(minX) - xMergeRadius),
        y: CGFloat(CGFloat(minY) - yMergeRadius),
        width: CGFloat(CGFloat(maxX - minX) + 2*xMergeRadius + 1),
        height: CGFloat(CGFloat(maxY - minY) + 2*yMergeRadius + 1)
      )
      mergeLabelRects.append(labelRect)
    }

    //Merge rects
//    var filteredMergeLabelRects = [CGRect]()
//    for rect in mergeLabelRects {
//      var intersectCount = 0
//      for (filteredRectIndex, filteredRect) in filteredMergeLabelRects.enumerated() {
//        if rect.intersects(filteredRect) {
//          intersectCount += 1
//          filteredMergeLabelRects[filteredRectIndex] = filteredRect.union(rect)
//        }
//      }
//      if intersectCount == 0 {
//        filteredMergeLabelRects.append(rect)
//      }
//    }

    return mergeLabelRects
  }
}
