import AppKit

struct Character: Hashable {
  var hashValue: Int {
    return outline.hashValue
  }
  static func ==(lhs: Character, rhs: Character) -> Bool {
    return lhs.outline == rhs.outline
  }
  mutating func setLineBounds(_ bounds: [Int]) {
    lineBounds = bounds
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
    self.id = id
    self.curChar = 0
    // we control the sticks for more speed
    var x = 0
    var y = 0
    let maxY = lineH - lineH / 6
    let minY = lineH / 3
    var spaceBefore = 0
    let moveXBy = 1
    var spaces = [Double]()
    var misfits = 0
    var misfitBig = 0
    var misfitWide = 0
    var misfitThin = 0
    
    // finds starts of chars and then pass to char outliner
    while true {
      if y > maxY  { // next col
        spaceBefore += moveXBy // sync with x
        x += moveXBy
        y = minY
      } else { // next row
        // could optimize this by skipping more
        // but that sacrifices space-finding accuracy
        y += lineH / 8
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
        guard var char = self.findCharacter(
          startX: xO,
          startY: yO,
          lineHeight: lineH,
          maxMoves: lineH * 60,
          initialMove: [0, moves.px], // we find it by going down vertically
          findHangers: true
        ) else {
          continue
        }
        // after find character, always move to next x
        y = maxY + 1
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
    if misfits > 0 {
      print("\(misfits) miss on \(id) \(misfitBig)b, \(misfitThin)t, \(misfitWide)w")
    }
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
        Images().writeCGImage(image: img, to: "\(debugDir)/b-hit\(id).png", resolution: 72) // write img
      }
    }
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
  func findCharacter(startX: Int, startY: Int, lineHeight: Int, maxMoves: Int, initialMove: [Int], findHangers: Bool) -> Character? {
    let exhaust = lineHeight * 6 // distance to go without finding new bound before finishing character
    var visited = Dictionary<Int, Bool?>() // for preventing crossing over at thin interections
    var topLeftBound = [startX, startY]
    var bottomRightBound = [startX, startY]
    var lastMove = initialMove // start move
    var outline: [String] = []
    var iteration = 0
    var x = startX
    var y = startY - moves.px // and one above where we found the first black px
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
        print("too many moves \(startX) \(startY)")
        return nil
      }
      if iteration % 8 == 0 {
        outline.append(String(lastMove[0] + 4) + String(lastMove[1] + 4))
      }
      curPos = y * perRow + x
      visited[curPos] = true
      curTry += 1
      if curTry > exhaust {
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
        if rightMoves > exhaust / 2 { // found underline
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
    let width = bottomRightBound[0] - topLeftBound[0] + 1
    var minY = topLeftBound[1]
    var height = bottomRightBound[1] - topLeftBound[1] + 1
    // now we have our character, lets see if theres a
    // blob above/below, to get i's and j's and ?'s
    if findHangers {
      let centerX = topLeftBound[0] + (width / 2)
      let maxPxOffset = lineHeight / 5
      let maxY = bottomRightBound[1]
      for y in 1...maxPxOffset {
        // go up
        if buffer[(minY - y) * perRow + centerX] < isBlackIfUnder {
          if let aboveChar = self.findCharacter(startX: centerX, startY: minY - y, lineHeight: lineHeight / 2, maxMoves: exhaust / 2, initialMove: [0, -moves.px], findHangers: false) {
            height += minY - aboveChar.y
            minY = aboveChar.y
            break
          }
        }
        // go down
        if buffer[(maxY + y) * perRow + centerX] < isBlackIfUnder {
          if let belowChar = self.findCharacter(startX: centerX, startY: maxY + y, lineHeight: lineHeight / 2, maxMoves: exhaust / 2, initialMove: [0, moves.px], findHangers: false) {
            height += belowChar.height + (belowChar.y - maxY)
            break
          }
        }
      }
    }
    // return char
    return Character(
      x: topLeftBound[0],
      y: minY,
      width: width,
      height: height,
      backMoves: startX - topLeftBound[0],
      outline: outline.joined(),
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
  
  public func charToString(_ char: Character, debugID: String) -> String {
    if char.lineBounds == nil {
      print("weird no bounds")
      return ""
    }
    if char.width == 0 || char.height == 0 {
      return ""
    }
    // right now char is in retina and line isnt :/ need to do this but it requires some attention
    // so for now just scaling them to match
    let retinaLineBounds = char.lineBounds!.map { $0 * 2 }
    // all in retina
    let frameSize = Float(28)
    let charY = retinaLineBounds[1] // use line Y
    let charW = Float(char.width)
    let offsetY = char.y - retinaLineBounds[1] // chary - liney
    var scaleX = Float(1.0)
    var scaleY = Float(1.0)
    var endX = 28
    var endY = 28
    // this is the bottom padding
    let heightDiff = retinaLineBounds[3] - char.height
    let totalHeight = Float(char.height + heightDiff)
    // scale it
    if char.width > char.height {
      scaleX = charW / frameSize
      if Float(char.height + offsetY) > frameSize { // big/wide
        scaleY = totalHeight / frameSize
      }
    } else {
      scaleY = totalHeight / frameSize
      if charW > frameSize { // big/wide
        scaleX = charW / frameSize
      }
    }
    endX = Int(charW / scaleX)
    endY = Int(Float(char.height + offsetY) / scaleY)
//    if debugID == "0-0-0" {
//      print("thin large l: \(scaleX) \(scaleY) \(endX) \(offsetY) \(char) \(retinaLineBounds)")
//    }
    var output = ""
    for y in 0..<28 {
      for x in 0..<28 {
        // past end of char, just fill with checkerboard
        if x > endX || y < offsetY / 2 || y > endY {
          output += (x + y * x) % 2 == 0 ? "1.0 " : "0.0 "
          continue
        }
        let xS = Int(Float(x) * scaleX)
        let yS = Int(Float(y) * scaleY)
        let luma = buffer[(charY + yS) * perRow + char.x + xS]
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
      for char in output.split(separator: " ") {
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

