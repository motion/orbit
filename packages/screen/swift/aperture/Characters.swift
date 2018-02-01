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

  private let dict = SymSpell(editDistance: 2, verbose: 1) // outline => close-answer
  private let images = Images()
  private var perRow: Int
  private var isBlackIfUnder = 0
  private let moves = Moves()
  private let specialDebug = [0, 0]
  private var curChar = 0
  private var id = 0

  func sdebug() -> Bool {
    return shouldDebug && specialDebug[0] == id && specialDebug[1] == curChar
  }

  init(buffer: UnsafeMutablePointer<UInt8>, perRow: Int, isBlackIfUnder: Int) {
    self.isBlackIfUnder = isBlackIfUnder // higher == allow lighter
    self.buffer = buffer
    self.perRow = perRow
  }

  func find(id: Int, bounds: [Int]) -> [Word] {
    let start = DispatchTime.now()
    let lineX = bounds[0] * 2
    let lineY = bounds[1] * 2
    let lineW = bounds[2]
    let lineH = bounds[3]
    var foundChars = [Character]()
    var pixels: [PixelData]? = nil
    self.id = id
    self.curChar = 0
    // we control the sticks for more speed
    var x = 0
    var y = 0
    let maxY = lineH - lineH / 3
    let minY = lineH / 3
    var spaceBefore = 0
    let moveXBy = 1
    var spaces = [Double]()
    
    // finds starts of chars and then pass to char outliner
    while true {
      if shouldDebug && pixels == nil && debugImg != nil {
        pixels = [PixelData](repeating: PixelData(a: 255, r: 255, g: 255, b: 255), count: lineW * lineH)
      }
      if y > maxY  { // next col
        spaceBefore += moveXBy // sync with x
        x += moveXBy
        y = minY
      } else { // next row
        // could optimize this by skipping more
        // but that sacrifices space-finding accuracy
        y += 2
      }
      // if reached last pixel, break
      if x >= lineW || y >= lineH || (x == lineW - 1 && y == lineH - 1) {
        break
      }
      let xO = x * 2 + lineX
      // rewind to topmost filled px if we passed it
      while y > 0 { if buffer[((y - 1) * 2 + lineY) * perRow + xO] < isBlackIfUnder { y -= 1 } else { break } }
      let yO = y * 2 + lineY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < isBlackIfUnder ? true : false
      if shouldDebug {
        let val = UInt8(isBlack ? 0 : 255)
        pixels![x + y * lineW] = PixelData(a: 255, r: val, g: val, b: val)
      }
      if isBlack {
        var char = self.findCharacter(
          startX: xO,
          startY: yO,
          maxHeight: lineH * 2
        )
        // after find character, always move to next x
        y = maxY + 1
        char.spaceBefore = spaceBefore
        if char.width == 0 || char.height == 0 {
          debug("0 size")
          continue
        }
        let tooBig = char.width * char.height > 1500
        let tooSmall = char.width < 5 && char.height < 5 || char.width < 2 || char.height < 2
        let tooThin = char.height / char.width > 25
        let tooWide = char.width / char.height > 25
        let misfit = tooBig || tooSmall || tooThin || tooWide
        if shouldDebug && debugImg != nil {
          let box = CGRect(x: char.x / 2 - frameOffset[0] * 2, y: char.y / 2 - frameOffset[1] * 2, width: char.width / 2, height: char.height / 2)
          if let img = images.cropImage(debugImg!, box: box) {
            images.writeCGImage(image: img, to: "/tmp/screen/\(misfit ? "charmiss-" : "char")\(id)-\(curChar).png")
          }
        }
        if misfit {
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
    if pixels != nil && pixels!.count > 0 && debugImg != nil {
      if let img = images.imageFromArray(pixels: pixels!, width: lineW, height: lineH) {
        Images().writeCGImage(image: img, to: "/tmp/screen/hit\(id).png", resolution: 72) // write img
      }
    }

    debug("Characters.find() \(foundChars.count): \(Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000)ms")
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

  func findCharacter(startX: Int, startY: Int, maxHeight: Int) -> Character {
    let exhaust = maxHeight * 2 // most amount to go without finding new bound before give up
    var visited = Dictionary<Int, Bool?>() // for preventing crossing over at thin interections
    var topLeftBound = [startX, startY]
    var bottomRightBound = [startX, startY]
    var lastMove = [-moves.px, moves.px] // we begin going left/down
    var outline: [String] = []
    var iteration = 0
    var x = startX
    var y = startY - moves.px // and one above where we found the first black px
    var curTry = 0
    var curPos = 0
    var foundEnd = false
    let clockwise = moves.clockwise
    let backwardsRange = stride(from: 1, to: 7, by: 2)
    while !foundEnd {
      iteration += 1
      if iteration % 8 == 0 {
        outline.append(String(lastMove[0] + 4) + String(lastMove[1] + 4))
      }
      curPos = y * perRow + x
      visited[curPos] = true
      curTry += 1
      if curTry > exhaust {
        debug("exhausted")
        foundEnd = true
        break
      }
      var success = false
      let moves = clockwise[lastMove[0]]![lastMove[1]]!
      for (index, attempt) in moves.enumerated() {
        let next = curPos + attempt[0] + attempt[1] * perRow
        if curTry > 10 && x == startX && y == startY {
//          debug("found end")
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
          let nextAttempt = moves[(index + x) % moves.count]
          let nextPixel = curPos + nextAttempt[0] + nextAttempt[1] * perRow
          if buffer[nextPixel] >= isBlackIfUnder { continue }
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
        if sdebug() {
          let xdir = lastMove[0] == -1 ? "l" : lastMove[0] == 0 ? "x" : "r"
          let ydir = lastMove[1] == -1 ? "u" : lastMove[1] == 0 ? "x" : "d"
          print(".. \(xdir) \(ydir) | \(lastMove[0]) \(lastMove[1]) | attempt \(index)")
        }
        break
      }
      if !success {
        break
      }
    }
    return Character(
      x: topLeftBound[0],
      y: topLeftBound[1],
      width: bottomRightBound[0] - topLeftBound[0] + 1,
      height: bottomRightBound[1] - topLeftBound[1] + 1,
      backMoves: startX - topLeftBound[0],
      outline: outline.joined(),
      letter: nil,
      spaceBefore: 0
    )
  }
  
  public func outlineToLetter(_ outline: String) -> String? {
    if answers[outline] != nil {
      return answers[outline]!
    }
    // optimize: only look for smaller chars
//    if outline.count < 25 {
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
//      if outline.count < 25 {
//        if self.dict.createDictionaryEntry(outline, language: "en") {
//        }
//      }
    }
  }
  
  public func charToString(_ char: Character, debugID: String) -> String {
    var output = ""
    let dbl = Float(28)
    if char.width == 0 || char.height == 0 {
      return ""
    }
    let width = Float(char.width)
    let height = Float(char.height)
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
        let luma = buffer[(char.y + yS) * perRow + char.x + xS]
        // luminance to intensity means we have to inverse it
        // warning, doing any sort of Int => String conversion here slows it down Bigly
        if luma < isBlackIfUnder {
          output += "0.0 "
        } else {
          output += "1.0 "
        }
        if shouldDebug {
          let brt = UInt8(luma < isBlackIfUnder ? 0 : 255)
          pixels!.append(PixelData(a: 255, r: brt, g: brt, b: brt))
        }
      }
    }
    output += "\n"
    if debugID != "" {
      let outFile = "\(debugDir)/c-\(debugID).png"
      images.writeCGImage(image: images.imageFromArray(pixels: pixels!, width: 28, height: 28)!, to: outFile, resolution: 72) // write img
    }
    return output
  }
}

