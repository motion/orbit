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

  private let dict = SymSpell(editDistance: 2, verbose: 1) // outline => close-answer
  private let images = Images()
  private var buffer: UnsafeMutablePointer<UInt8>
  private var perRow: Int
  private var maxLuma = 0
  private let moves = Moves()
  private let specialDebug = [0, 0]
  private var curChar = 0
  private var id = 0

  func sdebug() -> Bool {
    return shouldDebug && specialDebug[0] == id && specialDebug[1] == curChar
  }

  init(data: UnsafeMutablePointer<UInt8>, perRow: Int, maxLuma: Int) {
    self.maxLuma = maxLuma // higher == allow lighter
    self.buffer = data
    self.perRow = perRow
  }

  func find(id: Int, bounds: [Int]) -> [Word] {
    let start = DispatchTime.now()
    let lineX = bounds[0] * 2
    let lineY = bounds[1] * 2
    let lineW = bounds[2]
    let lineH = bounds[3]
    var foundWords = [Word]()
    var foundChars = [Character]()
    var pixels: [PixelData]? = nil
    self.id = id
    self.curChar = 0
    // we control the sticks for more speed
    var x = 0
    var y = 0
    let maxY = lineH - lineH / 3
    let minY = lineH / 3
    let spaceWidth = lineH / 5 // adjust based on line height
    var pxBetweenChars = 0
    
    func addWord() {
      foundWords.append(
        Word(
          x: foundChars.first!.x,
          y: foundChars.first!.y,
          width: foundChars.last!.x - foundChars.first!.x,
          height: foundChars.last!.y - foundChars.first!.y,
          characters: foundChars
        )
      )
      foundChars = []
    }
    
    // finds starts of chars and then pass to char outliner
    while true {
      if shouldDebug && pixels == nil && debugImg != nil {
        pixels = [PixelData](repeating: PixelData(a: 255, r: 255, g: 255, b: 255), count: lineW * lineH)
      }
      if y > maxY  { // next col
        pxBetweenChars += 2 // sync with x
        x += 2
        y = minY
      } else { // next row
        y += lineH / 5 // move height/x, spaced out, just needs one good pixel
      }
      // if reached last pixel, break
      if x >= lineW || y >= lineH || (x == lineW - 1 && y == lineH - 1) {
        break
      }
      let xO = x * 2 + lineX
      // rewind to topmost filled px if we passed it
      while y > 0 { if buffer[((y - 1) * 2 + lineY) * perRow + xO] < maxLuma { y -= 1 } else { break } }
      let yO = y * 2 + lineY
      let luma = buffer[yO * perRow + xO]
      let isBlack = luma < maxLuma ? true : false
      if shouldDebug {
        let val = UInt8(isBlack ? 0 : 255)
        pixels![x + y * lineW] = PixelData(a: 255, r: val, g: val, b: val)
      }
      if isBlack {
//        if shouldDebug && debugImg != nil {
          // this just helps to debug if you are cropping wrong somewhere else
//          let box = CGRect(x: xO / 2, y: yO / 2, width: 50, height: 50)
//          images.writeCGImage(image: images.cropImage(debugImg!, box: box)!, to: "/tmp/screen/view\(id)-\(curChar).png")
//        }
        var char = self.findCharacter(
          startX: xO,
          startY: yO,
          maxHeight: lineH * 2
        )
        if char.width == 0 || char.height == 0 {
          debug("0 size")
        } else {
          let tooSmall = char.width < 5 && char.height < 5 || char.width < 2 || char.height < 2
          let tooThin = char.height / char.width > 25
          let tooWide = char.width / char.height > 25
          let misfit = tooSmall || tooThin || tooWide
          if shouldDebug && debugImg != nil {
            let box = CGRect(x: char.x / 2 - frameOffset[0] * 2, y: char.y / 2 - frameOffset[1] * 2, width: char.width / 2, height: char.height / 2)
            if let img = images.cropImage(debugImg!, box: box) {
              images.writeCGImage(image: img, to: "/tmp/screen/\(misfit ? "charmiss-" : "char")\(id)-\(curChar).png")
            }
          }
          // go to next
          y = minY
          if misfit {
            x += 2
            continue
          }
          curChar += 1
          if let answer = outlineToLetter(char.outline) {
            char.letter = answer
          }
          // do this before adding next word
          if pxBetweenChars > spaceWidth && foundChars.count > 0 {
            addWord()
          }
          foundChars.append(char)
          let fwd = (char.width / 2 - char.backMoves / 2 + 2) // width - backtracks + 2
          let nextX = x + fwd
          if nextX <= x {
            x += 2
          } else {
            x = nextX
          }
          pxBetweenChars = 0
        } // end if
      } // end if
    } // end while
    
    // add final word
    if foundChars.count > 0 {
      addWord()
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
    return buffer[pos] < maxLuma
  }

  func findCharacter(startX: Int, startY: Int, maxHeight: Int) -> Character {
    let exhaust = maxHeight / 2 / moves.px // most amount to go without finding new bound before give up
    var visited = Dictionary<Int, Bool?>() // for preventing crossing over at thin interections
    var topLeftBound = [startX, startY]
    var bottomRightBound = [startX, startY]
    var lastMove = [0, moves.px] // we begin going down
    var outline: [String] = []
    var iteration = 0
    var x = startX
    var y = startY - moves.px // and one above where we found the first black px
    var curTry = 0
    var curPos = 0
    var foundEnd = false
    let clockwise = moves.clockwise
    while !foundEnd {
      iteration += 1
      if iteration % 8 == 0 {
        outline.append(String(lastMove[0] + 4) + String(lastMove[1] + 4))
      }
      curPos = y * perRow + x
      visited[curPos] = true
      curTry += 1
      if curTry > exhaust {
//        debug("exhausted")
        foundEnd = true
        break
      }
      var success = false
      for attempt in clockwise[lastMove[0]]![lastMove[1]]! {
        let next = curPos + attempt[0] + attempt[1] * perRow
        if curTry > 10 && x == startX && y == startY {
//          debug("found end")
          foundEnd = true
          break
        }
        // not black
        if buffer[next] >= maxLuma { continue }
        // already visited
        if visited[next] != nil { continue }
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
        break
      }
      if !success {
        break
      }
    }
    return Character(
      x: topLeftBound[0],
      y: topLeftBound[1],
      width: bottomRightBound[0] - topLeftBound[0] + 2,
      height: bottomRightBound[1] - topLeftBound[1] + 2,
      backMoves: startX - topLeftBound[0],
      outline: outline.joined(),
      letter: nil
    )
  }
  
  public func outlineToLetter(_ outline: String) -> String? {
    if answers[outline] != nil {
      return answers[outline]!
    }
    // optimize: only look for smaller chars
    if outline.count < 25 {
      let start = DispatchTime.now()
      let closeOutlines = dict.correct(outline, language: "en")
      let end = Double(DispatchTime.now().uptimeNanoseconds - start.uptimeNanoseconds) / 1_000_000
      if end > 10 {
        print(" slow lcache check: \(end)ms")
        print(" \(dict.dictionary.count)  \(dict.wordList.count) ")
      }
      if closeOutlines.count > 0 {
        print("found a close outline!")
        return answers[closeOutlines[0].term]
      }
    }
    return nil
  }
  
  public func updateCache(_ cache: [String: String]) {
    Async.background {
      for entry in cache {
        let (outline, letter) = entry
        self.answers[outline] = letter
        if outline.count < 25 {
          if self.dict.createDictionaryEntry(outline, language: "en") {
          }
        }
      }
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
        if luma < 50 { // white
          output += "0.2 "
        } else if luma < 100 {
          output += "0.4 "
        } else if luma < 150 {
          output += "0.6 "
        } else if luma < 200 {
          output += "0.8 "
        } else {  // black
          output += "1.0 "
        }
        if shouldDebug {
          let brt = UInt8(luma < self.maxLuma ? 0 : 255)
          pixels!.append(PixelData(a: 255, r: brt, g: brt, b: brt))
        }
      }
    }
    output += "\n"
    if shouldDebug {
      let outFile = "\(debugDir)/xa\(debugID)-\(index).png"
      images.writeCGImage(image: images.imageFromArray(pixels: pixels!, width: 28, height: 28)!, to: outFile, resolution: 72) // write img
    }
    return output
  }
}

