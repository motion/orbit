import Foundation

/*
 * Implements 4-connectivity connected component labelling. Call the `labelImageFast` function to label your image.
 * Optionally, the bounding boxes of the components can be computed by passing-in `true` for the
 * `calculateBoundingBoxes` parameter.
 */

class ConnectedComponents {
  
  // Implementation notes: a 2 pass approach is used, with the first pass performing preliminary labelling,
  // and identifying labels that should be merged. The first pass can also perform merging itself, under
  // certain circumstances, as an optimisation. The labels are then merged, and a second pass is performed
  // to apply the final (merged) labels to the content.
  func labelImageFast(image: CGImage, calculateBoundingBoxes: Bool) -> LabelledData {
    let rawImageData = getRawImageData(cgImage: image)
    return labelImageFast(data: rawImageData, calculateBoundingBoxes: calculateBoundingBoxes)
  }
  
  func labelImageFast(data: [[Bool]], calculateBoundingBoxes: Bool) -> LabelledData {
    let width = data[0].count
    let height = data.count
    var labelMerges = [Int: Set<Int>]()
    var outputData: [[Int]] = Array(repeating: [], count: height)
    var label = 0
    
    for row in 0 ..< height {
      var outputRow: [Int] = Array(repeating: -1, count: width)
      let currentRow = data[row]
      let previousOutputRow = (row > 0 ? outputData[row-1] : [Int]())
      var previousPixelLabel = -1
      var startColForCurrentLabel = -1
      var canMergeInPlace = false
      
      for col in 0 ..< width {
        if (currentRow[col]) {
          // The pixel is black so it needs to be labelled.
          let sameColInPreviousRowLabel = (row > 0 ? previousOutputRow[col] : -1)
          var currentPixelLabel: Int
          if (previousPixelLabel >= 0) {
            // If the previous pixel in this column was
            // labelled, then this pixel always inherits that label
            currentPixelLabel = previousPixelLabel
            if (sameColInPreviousRowLabel >= 0 && sameColInPreviousRowLabel != currentPixelLabel) {
              // Under certain circumstances we can do an "in-place" merge as an optimization.
              // This means changing the values of the current component in the current row to
              // the value inherited from the previous row. We can only do this if we have not
              // done an in-place merge already for this component in this row, and if we started
              // this component with a new label.
              if (canMergeInPlace) {
                currentPixelLabel = sameColInPreviousRowLabel
                for i in startColForCurrentLabel ..< col {
                  outputRow[i] = currentPixelLabel
                }
                canMergeInPlace = false
              }
              else {
                // If the same row in the previous column is not equal to the current
                // label then they must be merged. Add an entry to labelMerges.
                if var existingMerges = labelMerges[currentPixelLabel] {
                  existingMerges.insert(sameColInPreviousRowLabel)
                  labelMerges[currentPixelLabel] = existingMerges
                }
                else {
                  labelMerges[currentPixelLabel] = [sameColInPreviousRowLabel]
                }
              }
            }
          }
          else if (sameColInPreviousRowLabel >= 0) {
            // If the same column in the previous row is labelled
            // then this pixel inherits that label
            currentPixelLabel = sameColInPreviousRowLabel
          }
          else {
            // Otherwise, this pixel gets a new label. We also set canMergeInPlace to true
            // since this is a new label for a new component in this row, which is a candidate
            // for an in-place merge
            currentPixelLabel = label
            label += 1
            canMergeInPlace = true
            startColForCurrentLabel = col
          }
          outputRow[col] = currentPixelLabel
          previousPixelLabel = currentPixelLabel
        }
        else {
          // The pixel is white. Reset the previousPixelLabel and set canMergeInPlace to false
          previousPixelLabel = -1
          canMergeInPlace = false
          startColForCurrentLabel = -1
        }
      }
      
      outputData[row] = outputRow
    }
    
    // Compress the label merges so that each label points to its ultimate
    // destination, or -1 if it is not merged
    let finalLabels = getFinalLabels(labelMerges: &labelMerges)
    return computeFinalData(finalLabels: finalLabels, height: height, width: width,
                            calculateBoundingBoxes: calculateBoundingBoxes, outputData: &outputData)
  }
  
  func printRawImageData(rawData: [[Bool]]) {
    for y in 0 ..< rawData.count {
      for x in 0 ..< rawData[0].count {
        if (rawData[y][x]) {
          print("###", terminator: "")
        }
        else {
          print("   ", terminator: "")
        }
      }
      print("")
    }
  }

  func printLabelData(rawData: [[Int]]) {
    var maxLabelLength = 0
    for y in 0 ..< rawData.count {
      for x in 0 ..< rawData[0].count {
        let labelLength = String(rawData[y][x]).count
        if (labelLength > maxLabelLength) {
          maxLabelLength = labelLength
        }
      }
    }
    for y in 0 ..< rawData.count {
      for x in 0 ..< rawData[0].count {
        let label = rawData[y][x]
        if (label >= 0) {
          print(pad(val: label, length: maxLabelLength), terminator: ",")
        }
        else {
          print(padEmpty(length: maxLabelLength), terminator: ",")
        }
      }
      print("")
    }
  }
  
  private func computeFinalData(finalLabels: [Int: Component], height: Int, width: Int,
                                calculateBoundingBoxes: Bool, outputData: inout [[Int]]) -> LabelledData {
    var boundingBoxes = [Int: BoundingBox]()
    var nonBackgroundPixels = 0
    
    for row in 0 ..< height {
      var previousLabelInRow = -1
      for col in 0 ..< width {
        var label = outputData[row][col]
        if (label >= 0) {
          nonBackgroundPixels += 1
          if let component = finalLabels[label] {
            if (component.getLabel() != label) {
              label = component.getLabel()
              outputData[row][col] = label
            }
          }
        }
        // If the label has changed (or we have reached the end of the row)
        // then we may need to expand the bounding box, or create a new one
        if (calculateBoundingBoxes && (label != previousLabelInRow || col == width - 1)) {
          // If the previous pixel was black then its bounding box will need to be expanded
          // (we have reached the end of the row for this component). Otherwise, if
          // the previous pixel was white then we may need to create a new bounding box
          // (this is potentially the start of the component).
          if previousLabelInRow >= 0 {
            boundingBoxes[previousLabelInRow]?.expand(x: col-1, y: row)
          }
          else if label >= 0 && boundingBoxes[label] == nil {
            boundingBoxes[label] = BoundingBox(label: label, x_start: col, y_start: row)
          }
        }
        previousLabelInRow = label
      }
    }
    
    if (calculateBoundingBoxes) {
      return LabelledData(labelMatrix: outputData, nonBackgroundPixels: nonBackgroundPixels, boundingBoxes: boundingBoxes)
    }
    else {
      return LabelledData(labelMatrix: outputData, nonBackgroundPixels: nonBackgroundPixels, boundingBoxes: nil)
    }
    
  }
  
  private func getFinalLabels(labelMerges: inout [Int: Set<Int>]) -> [Int: Component] {
    var finalLabels = [Int: Component]()
    for (from, toList) in labelMerges {
      for to in toList {
        var fromComponent = finalLabels[from]
        if (fromComponent == nil) {
          fromComponent = Component(child: from)
          finalLabels[from] = fromComponent
        }
        var toComponent = finalLabels[to]
        if (toComponent == nil) {
          toComponent = fromComponent
          fromComponent?.addChildLabel(child: to)
          finalLabels[to] = toComponent
        }
        if (fromComponent !== toComponent) {
          if (fromComponent!.size() < toComponent!.size()) {
            toComponent?.merge(component: fromComponent!)
            for child in (fromComponent?.childLabels)! {
              finalLabels[child] = toComponent
            }
          }
          else {
            fromComponent?.merge(component: toComponent!)
            for child in (toComponent?.childLabels)! {
              finalLabels[child] = fromComponent
            }
          }
        }
      }
    }
    return finalLabels
  }
  
  private func getRawImageData(cgImage: CGImage) -> [[Bool]] {
    let width = cgImage.width
    let height = cgImage.height
    let bytesPerRow = cgImage.bytesPerRow
    let bitsPerComponent = cgImage.bitsPerComponent
    let bitsPerPixel = cgImage.bitsPerPixel
    let componentsPerPixel = Int(bitsPerPixel / bitsPerComponent)
    var data: [[Bool]] = Array(repeating: Array(repeating: false, count: width), count: height)
    let pixelData = cgImage.dataProvider!.data
    let rawData: UnsafePointer<UInt8> = CFDataGetBytePtr(pixelData)
    let threshold = UInt8(255.0 / 2.0)
    var pointerOffset = 0;
    for row in 0 ..< height {
      for column in 0 ..< width {
        // Since the image is binarized (black and white) there is no point
        // in checking any pixel other than the first one
        if (rawData[pointerOffset] < threshold) {
          data[row][column] = true
        }
        // We assume that each component is one byte here
        pointerOffset += componentsPerPixel
      }
      // There appears to be extra data at the end of each row on a real device (not the simulator)
      // so we need to discard this
      pointerOffset += (bytesPerRow - (width * componentsPerPixel))
    }
    return data
  }
  
  private func padEmpty(length: Int) -> String {
    var newString = String("")
    for _ in 0 ..< length {
      newString.insert(" ", at: newString.startIndex)
    }
    return newString
  }
  
  private func pad(val: Int, length: Int) -> String {
    var newString = String(val)
    let lengthDifference = length - newString.count
    for _ in 0 ..< lengthDifference {
      newString.insert("0", at: newString.startIndex)
    }
    return newString
  }
  
  private class Component: CustomStringConvertible {
    var childLabels: Set<Int>
    init(child: Int) {
      childLabels = [child]
    }
    func addChildLabel(child: Int) {
      childLabels.insert(child)
    }
    func getChildLabels() -> Set<Int> {
      return childLabels
    }
    func size() -> Int {
      return childLabels.count
    }
    func merge(component: Component) {
      childLabels.formUnion(component.childLabels)
    }
    func addChild(child: Int) {
      childLabels.insert(child)
    }
    func getLabel() -> Int {
      // This is arbitrary, but that's fine; we just need it to be consistent across calls
      return childLabels.first!
    }
    var description: String {
      return childLabels.description
    }
  }
}

class LabelledData {
  let labelMatrix: [[Int]]
  let nonBackgroundPixels: Int
  let boundingBoxes: [Int: BoundingBox]?
  init(labelMatrix: [[Int]], nonBackgroundPixels: Int, boundingBoxes: [Int: BoundingBox]?) {
    self.labelMatrix = labelMatrix
    self.nonBackgroundPixels = nonBackgroundPixels
    self.boundingBoxes = boundingBoxes
  }
}

class BoundingBox : CustomStringConvertible {
  var label: Int
  var x_start: Int
  var x_end: Int
  var y_start: Int
  var y_end: Int
  
  init(label: Int, x_start: Int, y_start: Int) {
    self.label = label
    self.x_start = x_start
    self.y_start = y_start
    self.x_end = x_start
    self.y_end = y_start
  }
  
  func expand(x: Int, y: Int) {
    if x > self.x_end {
      self.x_end = x
    }
    if y > self.y_end {
      self.y_end = y
    }
  }
  
  func getLabel() -> Int {
    return label
  }
  
  func getHeight() -> Int {
    return (y_end - y_start) + 1
  }
  
  func getWidth() -> Int {
    return (x_end - x_start) + 1
  }
  
  func getSize() -> Int {
    return getWidth() * getHeight()
  }
  
  var description: String {
    return "Bounding box (" + String(x_start) + "," +  String(y_start) +
      "-" + String(x_end) + "," + String(y_end) + ") (size: " + String(getSize()) + ")"
  }
}

