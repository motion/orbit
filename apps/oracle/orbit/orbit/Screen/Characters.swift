import AppKit

struct Character: Hashable {
  var hashValue: Int {
    return outline.hashValue
  }
  static func ==(lhs: Character, rhs: Character) -> Bool {
    return lhs.outline == rhs.outline
  }
  var x: Int
  var y: Int
  var width: Int
  var height: Int
  var backMoves: Int
  var outline: String
  var letter: String?
  var spaceBefore: Int
  var completedOutline: Bool
  var lineBounds: [Int]?
}

func standardDeviation(_ arr: [Double]) -> Double {
  let length = Double(arr.count)
  let avg = arr.reduce(0, +) / length
  let sumOfSquaredAvgDiff = arr.map { pow($0 - avg, 2.0)}.reduce(0, +)
  return sqrt(sumOfSquaredAvgDiff / length)
}

struct Word {
  var x: Int
  var y: Int
  var width: Int
  var height: Int
  var characters: [Character]
}

class Characters {
  // public
  var frameOffset: [Int] = [0, 0]
  var shouldDebug = false
  var debugImg: CGImage? = nil
  var debugDir = ""
  var answers = [String: String]() // outline => answer
  var buffer: UnsafeMutablePointer<UInt8>

  private let images = Images()
  private var perRow: Int
  private var isBlackIfUnder = 0
  private let moves = Moves()
  private let specialDebug = [0, 0]

  init(buffer: UnsafeMutablePointer<UInt8>, perRow: Int, isBlackIfUnder: Int) {
    self.isBlackIfUnder = isBlackIfUnder // higher == allow lighter
    self.buffer = buffer
    self.perRow = perRow
  }

  func find(id: Int, bounds: [Int]) -> [Word] {
//    let start = DispatchTime.now()
    let lineX = bounds[0] * 2
    let lineY = bounds[1] * 2
    let lineW = bounds[2]
    let lineH = bounds[3]
    // roughly, dont allow chars that take up more area than
    // lineheight * line height * x (one square frame times x)
    let MAX_CHAR_AREA = lineH * lineH * 3
    var foundChars = [Character]()
    var pixels: [PixelData]? = nil
    if shouldDebug && pixels == nil && debugImg != nil {
      pixels = [PixelData](repeating: PixelData(a: 255, r: 255, g: 255, b: 255), count: lineW * lineH)
    }
    // we control the sticks for more speed
    var x = 0
    var y = 0
    let maxY = lineH - lineH / 6
    let minY = 0
    var spaceBefore = 0
    let moveXBy = 1
    var spaces = [Double]()
    var misfits = 0
    var misfitBig = 0
    var misfitWide = 0
    var misfitThin = 0
    var curChar = 0
    
    // finds starts of chars and then pass to char outliner
    while true {
      if y > maxY  { // next col
        spaceBefore += moveXBy // sync with x
        x += moveXBy
        y = minY
      } else { // next row
        // could optimize this by skipping more
        // but that sacrifices space-finding accuracy
        y += max(1, lineH / 12)
      }
      // if reached last pixel, break
      if x >= lineW || y >= lineH || (x == lineW - 1 && y == lineH - 1) {
        break
      }
      let xO = x * 2 + lineX
      // rewind to topmost filled px if we passed it
      while y > 0 {
        let isBlackAbove = buffer[((y - 1) * 2 + lineY) * perRow + xO] < isBlackIfUnder
        if  isBlackAbove { y -= 1 } else { break }
      }
      let yO = y * 2 + lineY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < isBlackIfUnder ? true : false
      if shouldDebug {
        let val = UInt8(isBlack ? 0 : 255)
        pixels![x + y * lineW] = PixelData(a: 255, r: val, g: val, b: val)
      }
      if isBlack {
        let percentDownLine = Float(y) / Float(lineH)
        let debugID = "\(id)-\(curChar)"
        
        // todo: line detection/removal here
        
        guard var char = self.findCharacter(
          startX: xO,
          startY: yO,
          lineHeight: lineH * 2, // in retina
          maxMoves: lineH * 100, // not needed for first time really
          initialMove: [0, moves.px], // we find it by going down vertically
          findHangers: true,
          percentDownLine: percentDownLine,
          debugID: debugID
        ) else {
          print("no char")
          y = maxY + 1 // move to next
          continue
        }
        // after find character, always move to next x
        y = maxY + 1 // next step itll move both x and y
        // try and merge weird overhanging i'ss
        if var last = foundChars.last {
          // mostly overlapping
          let lastCharEndX = last.x + last.width
          let newCharEndX = char.x + char.width
          let bckwdMovement = lastCharEndX - char.x
          let fwdMovement = newCharEndX - lastCharEndX
          if fwdMovement < bckwdMovement * 3 || bckwdMovement > 16  {
            print("absorb line \(id) char \(foundChars.count)")
            // have last one eat it up
            last.width += char.x + char.width
            // and move on
            x += newCharEndX - lastCharEndX + char.width + 1
          }
        }
        char.spaceBefore = spaceBefore
        if char.width == 0 || char.height == 0 {
          debug("0 size")
          continue
        }
        let tooBig = char.width * char.height > MAX_CHAR_AREA
//        let tooSmall = char.width < 5 && char.height < 5 || char.width < 2 || char.height < 2
        let tooThin = char.height / char.width > 25
        let tooWide = char.width / char.height > 25
        let misfit = tooBig || tooThin || tooWide
        if shouldDebug && debugImg != nil {
          let box = CGRect(x: char.x / 2 - frameOffset[0] * 2, y: char.y / 2 - frameOffset[1] * 2, width: char.width / 2, height: char.height / 2)
          if let img = images.cropImage(debugImg!, box: box) {
            images.writeCGImage(image: img, to: "/tmp/screen/\(misfit ? "c-miss-" : "c-")\(id)-\(curChar).png")
          }
        }
        if misfit {
          misfits += 1
//          print("misfit \(id)-\(curChar) \(misfitBig)b, \(misfitThin)t, \(misfitWide)w")
          if tooBig { misfitBig += 1 }
          if tooWide { misfitWide += 1 }
          if tooThin { misfitThin += 1 }
          continue
        }
        curChar += 1
        if let answer = outlineToLetter(char.outline) {
          char.letter = answer
        }
        foundChars.append(char)
        spaces.append(Double(spaceBefore))
        spaceBefore = 0
        // move x forward character width - backtracks + 2
        x = x + (char.width / 2 - char.backMoves / 2)
      } // end if
    } // end while
    // help watch misfit counts
//    if misfits > 0 {
//      print("\(misfits) miss on \(id)")
//    }
    // find words
    var foundWords = [Word]()
    // calculate std dev of space
    let avg = spaces.reduce(0, +) / Double(spaces.count)
    // space = % of a std dev
    let spaceWidth = standardDeviation(spaces) / 1.5
    var wordChars = [Character]()
    // chop out words
    var minYL = 1000000000
    var maxYL = 0
    for (index, char) in foundChars.enumerated() {
      if (char.height + char.y) > maxYL {
        maxYL = (char.height + char.y)
      }
      if char.y < minYL {
        minYL = char.y
      }
      // one deviation above avg
      let isLast =  index == foundChars.count - 1
      if spaces[index] > avg + spaceWidth || isLast {
        if isLast {
          wordChars.append(char)
        }
        if wordChars.count > 0 {
          let firstChar = wordChars.first!
          let lastChar = wordChars.last!
          var width: Int
          if wordChars.count == 1 {
            width = firstChar.width
          } else {
            width = (lastChar.x + lastChar.width) - firstChar.x
          }
          foundWords.append(
            // adjust for retina
            Word(
              x: firstChar.x / 2,
              y: minYL / 2,
              width: width / 2,
              height: (maxYL - minYL) / 2,
              characters: wordChars
            )
          )
          wordChars = []
        }
      }
      // append char after so we keep index
      wordChars.append(char)
    }
    // finish, write string
//    if pixels != nil && pixels!.count > 0 && debugImg != nil {
//      if let img = images.imageFromArray(pixels: pixels!, width: lineW, height: lineH) {
//        Images().writeCGImage(image: img, to: "\(debugDir)/b-hit\(id).png", resolution: 72) // write img
//      }
//    }
//    print("Characters.find \(id): found \(foundChars.count) in \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
    return foundWords
  }

  func debug(_ str: String) {
    if shouldDebug {
      print(str)
    }
  }

  func isBlack(_ pos: Int) -> Bool {
    return buffer[pos] < isBlackIfUnder
  }

  // exhaust - moves to go without finding new bound before giving up
  //    if exhausted, still will return a character
  // maxMoves - moves to go total before giving up
  //    if maxMoves reached, will return nil
  func findCharacter(startX: Int, startY: Int, lineHeight: Int, maxMoves: Int, initialMove: [Int], findHangers: Bool, percentDownLine: Float, debugID: String) -> Character? {
    let exhaust = lineHeight * 6 // distance to go without finding new bound before finishing character
    var visited = Dictionary<Int, Bool?>() // for preventing crossing over at thin interections
    var topLeftBound = [startX, startY]
    var bottomRightBound = [startX, startY]
    var lastMove = initialMove // start move
    var outline = ""
    var iteration = 0
    var x = startX
    var y = startY - moves.px // subtracting here fixes bugs for real
    var curTry = 0
    var curPos = 0
    var foundEnd = false
    let clockwise = moves.clockwise
    let backwardsRange = stride(from: 1, to: 7, by: 2) // could increase potenitally
    var exhausted = false
    var rightMoves = 0 // to detect if ran into underline and are moving right a ton
    while !foundEnd {
      iteration += 1
      if iteration > maxMoves {
        if !findHangers {
          print("too many moves on regular char \(findHangers)")
        }
        return nil
      }
      // every lineHeight/10 moves, record outline
      if iteration % (lineHeight / 10) == 0 {
        outline += String(lastMove[0] + 4) + String(lastMove[1] + 4)
      }
      curPos = y * perRow + x
      // remember weve been here
      visited[curPos] = true
      curTry += 1
      if curTry > exhaust {
        print("exhaust \(debugID)")
        exhausted = true
        foundEnd = true
        break
      }
      var success = false
      let fwdMoves = clockwise[lastMove[0]]![lastMove[1]]!
      for (index, attempt) in fwdMoves.enumerated() {
        let next = curPos + attempt[0] + attempt[1] * perRow
        if curTry > 10 && x == startX && y == startY { // found end!
          foundEnd = true
          break
        }
        // not black
        if buffer[next] >= isBlackIfUnder { continue }
        // already visited
        if visited[next] != nil { continue }
        // ensure backwards x pixels are also black
        // avoids small connections 
        for x in backwardsRange {
          let nextAttempt = fwdMoves[(index + x) % fwdMoves.count]
          let nextPixel = curPos + nextAttempt[0] + nextAttempt[1] * perRow
          if buffer[nextPixel] >= isBlackIfUnder { continue }
        }
        // prevent underlines from being found by tracking right moves
        if attempt[0] == moves.px && attempt[1] == 0 {
          rightMoves += 1
        } else {
          rightMoves = 0
        }
        if rightMoves > exhaust { // found underline
//          print("breaking due to right")
          break
        }
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
        // reset curTry if we found a new bound
        if newEndX { curTry = 0; bottomRightBound[0] = x }
        else if newStartX { curTry = 0; topLeftBound[0] = x }
        if newStartY { curTry = 0; topLeftBound[1] = y }
        else if newEndY { curTry = 0; bottomRightBound[1] = y }
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
//          let xdir = lastMove[0] == -1 ? "l" : lastMove[0] == 0 ? "x" : "r"
//          let ydir = lastMove[1] == -1 ? "u" : lastMove[1] == 0 ? "x" : "d"
//          print(".. \(xdir) \(ydir) | \(lastMove[0]) \(lastMove[1]) | attempt \(index)")
//        }
        break
      }
      if !success {
        break
      }
    }
    // shared variables for hanger finding
    let minX = topLeftBound[0]
    var width = bottomRightBound[0] - topLeftBound[0] + 1
    var minY = topLeftBound[1]
    var height = bottomRightBound[1] - topLeftBound[1] + 1
    // now we have our character, lets see if theres a
    // blob above/below, to get i's and j's and ?'s
    if findHangers {
      let centerX = topLeftBound[0] + (width / 2)
      let maxDownPx = Int((1.0 - percentDownLine) * Float(lineHeight) / 2.2) // pxs left in line downwards
      let maxUpPx = Int(percentDownLine * Float(lineHeight) / 2.2) // pxs left in line upwards
//      print("line \(debugID) maxup \(maxUpPx) maxdown \(maxDownPx)")
      let maxY = bottomRightBound[1]
      if maxUpPx > 2 {
        // go up
        for y in 1...maxUpPx {
          if buffer[(minY - y) * perRow + centerX] < isBlackIfUnder {
            if let c = self.findCharacter(startX: centerX, startY: minY - y, lineHeight: lineHeight, maxMoves: lineHeight * 10, initialMove: [0, -moves.px], findHangers: false, percentDownLine: percentDownLine, debugID: debugID + "-hanger") {
              if c.width * c.height > maxUpPx * maxUpPx * 4 { print("hanger above area big \(debugID)"); break } // too big
              if c.height > maxUpPx * 4 { print("hanger above tall \(debugID)"); break } // too tall
              height += minY - c.y
              minY = c.y
              let widthWithChar = c.x + c.width - minX
              width = max(widthWithChar, width)
              outline += c.outline
              break
            }
          }
        }
      }
      if maxDownPx > 1 {
        // go down
        for y in 1...maxDownPx {
          if buffer[(maxY + y) * perRow + centerX] < isBlackIfUnder {
            if let c = self.findCharacter(startX: centerX, startY: maxY + y, lineHeight: lineHeight, maxMoves: lineHeight * 10, initialMove: [0, moves.px], findHangers: false, percentDownLine: percentDownLine, debugID: debugID + "-hangar") {
              if c.width * c.height > maxDownPx * maxDownPx * 4 { break } // too big
              if c.height > maxDownPx * 4 { break } // too tall
              height += c.height + (c.y - maxY)
              let widthWithChar = c.x + c.width - minX
              width = max(widthWithChar, width)
              outline += c.outline
              break
            }
          }
        }
      }
    }
    // return char
    return Character(
      x: minX,
      y: minY,
      width: width,
      height: height,
      backMoves: startX - topLeftBound[0],
      outline: outline,
      letter: nil,
      spaceBefore: 0,
      completedOutline: !exhausted,
      lineBounds: nil
    )
  }
  
  public func outlineToLetter(_ outline: String) -> String? {
    if answers[outline] != nil {
      return answers[outline]!
    }
    // optimize: only look for smaller chars
//    if outline.count < 20 {
//      let start = DispatchTime.now()
//      let closeOutlines = dict.correct(outline, language: "en")
//      let end = Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000
//      if end > 10 {
//        print(" slow lcache check: \(end)ms")
//        print(" \(dict.dictionary.count)  \(dict.wordList.count) ")
//      }
//      if closeOutlines.count > 0 {
//        print("found a close outline!")
//        return answers[closeOutlines[0].term]
//      }
//    }
    return nil
  }
  
  public func updateCache(_ cache: [String: String]) {
    for entry in cache {
      let (outline, letter) = entry
      self.answers[outline] = letter
//      if outline.count < 20 {
//        _ = self.dict.createDictionaryEntry(outline, language: "en")
//      }
    }
  }
  
  func cropToFillBox(width: Float, height: Float, max: Float) -> (Float, Float) {
    var scaleX = Float(1)
    var scaleY = Float(1)
    if width > max {
      scaleX = width / max
    } else if width < max {
      scaleX = 1 / (max / width)
    }
    if height > max {
      scaleY = height / max
    } else if height < max {
      scaleY = 1 / (max / height)
    }
    return (scaleX, scaleY)
  }
  
  public func charToString(_ char: Character, debugID: String) -> String {
    if char.lineBounds == nil {
      print("weird no bounds")
      return ""
    }
    if char.width == 0 || char.height == 0 {
      return ""
    }
    let offset = 4
    let dbl = Float(28 - offset)
    let retinaLineBounds = char.lineBounds!.map { $0 * 2 }
    let lineMaxY = (retinaLineBounds[1] + retinaLineBounds[3])
    let charMaxY = (char.y + char.height)
    let topPad = max(0, char.y - retinaLineBounds[1])
    let bottomPad = max(0, lineMaxY - charMaxY)
    let width = Float(char.width)
    let height = Float(char.height)
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
    var output = ""
    let smallSize = Float(retinaLineBounds[3]) / 4
    let bigSize = Float(retinaLineBounds[3]) / 2
    for y in 0..<28 {
      for x in 0..<28 {
        if x < offset {
          // encode a dot for bigtoppad
          if y < 4 {
            if topPad > retinaLineBounds[3] / 2 {
              output += "0.0 "
              continue
            }
          }
          // encode a dot for bigbottompad
          if y < 12 && y >= 8 {
            if bottomPad > retinaLineBounds[3] / 2 {
              output += "0.0 "
              continue
            }
          }
          // encode a dot for reallysmall
          if y < 20 && y >= 16 {
            if width < smallSize && height < smallSize {
              output += "0.0 "
              continue
            }
          }
          // encode a dot for reallythin
          if y < 28 && y >= 24 {
            if width < smallSize {
              output += "0.0 "
              continue
            }
          }
          output += "1.0 "
          continue
        }
        if y < offset {
          if x < 12 && x >= 8 {
            // encode a dot for mediumtoppad
            if topPad > retinaLineBounds[3] / 6 {
              output += "0.0 "
              continue
            }
          }
          if x < 20 && x >= 16 {
            // encode a dot for squarishly big
            if width > bigSize && height > bigSize {
              output += "0.0 "
              continue
            }
          }
          output += "1.0 "
          continue
        }
        let xS = Int(Float(x - offset) * scaleX)
        let yS = Int(Float(y - offset) * scaleY)
        let luma = buffer[(char.y + yS) * perRow + char.x + xS]
        // luminance to intensity means we have to inverse it
        // warning, doing any sort of Int => String conversion here slows it down Bigly
        if luma < isBlackIfUnder {
          output += "0.0 "
        } else {
          output += "1.0 "
        }
      }
    }
    if shouldDebug && debugID != "" {
      var pixels = [PixelData]()
      let values = output.split(separator: " ")
      for char in values {
        let brt = UInt8(char == "0.0" ? 0 : 255)
        pixels.append(PixelData(a: 255, r: brt, g: brt, b: brt))
      }
      let outFile = "\(debugDir)/c-\(debugID).png"
      let img = images.imageFromArray(pixels: pixels, width: 28, height: 28)!
      images.writeCGImage(image: img, to: outFile, resolution: 72)
    }
    output += "\n"
    return output
  }
}

