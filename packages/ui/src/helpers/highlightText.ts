// @ts-ignore
import { flatten } from 'lodash'

const splitChar = '🂓'

// cut text down using highlight words
// not a wonderfully efficient
// but still great for not too long text
// and pretty easy to follow
export const highlightText = (options, returnList = false) => {
  const {
    text,
    words,
    trimWhitespace,
    maxChars = 500,
    maxSurroundChars = 50,
    style = 'font-weight: 600; color: #000;',
    separator = '&nbsp;&nbsp;&middot;&nbsp;&nbsp;',
  } = options
  let parts = [text]
  if (trimWhitespace) {
    parts[0] = parts[0].replace(/(\s{2,}|\n)/g, separator)
  }
  const wordFinders = words.map(word => new RegExp(`(${word})`, 'gi'))
  // split all the highlight words:
  for (const [index] of words.entries()) {
    const regex = wordFinders[index]
    parts = flatten(parts.map(piece => piece.split(regex)))
  }
  // find maximum length of surrounding text snippet
  const numSurrounds = parts.length / 2
  const wordsLen = words.reduce((a, b) => a + b.length, 0)
  const restLen = maxChars - wordsLen
  const surroundMax = Math.min(maxSurroundChars, restLen / numSurrounds / 2)
  const isHighlightWord = str =>
    str ? words.indexOf(str.toLowerCase()) > -1 : false
  // trim it down
  const filtered = []
  let prev
  for (const [index, part] of parts.entries()) {
    const highlighted = isHighlightWord(part)
    const prevHighlighted = prev
    prev = highlighted
    if (highlighted) {
      filtered.push(part)
      continue
    }
    const nextHighlighted = isHighlightWord(parts[index + 1])
    // if not close, ignore
    if (!prevHighlighted && !nextHighlighted) {
      continue
    }
    if (prevHighlighted && !nextHighlighted) {
      if (part.length > surroundMax) {
        filtered.push(part.slice(0, surroundMax)) + splitChar
      } else {
        filtered.push(part)
      }
      continue
    }
    if (!prevHighlighted && nextHighlighted) {
      if (part.length > surroundMax) {
        filtered.push(splitChar + part.slice(part.length - surroundMax))
      } else {
        filtered.push(part)
      }
      continue
    }
    if (prevHighlighted && nextHighlighted) {
      if (part.length > surroundMax * 2) {
        filtered.push(
          part.slice(0, surroundMax) +
            splitChar +
            part.slice(part.length - surroundMax),
        )
      } else {
        filtered.push(part)
      }
    }
  }
  let final = []
  for (const part of filtered) {
    if (words.indexOf(part.toLowerCase()) === 0) {
      final.push(`<span style="${style}">${part}</span>`)
    } else {
      final.push(part)
    }
  }
  let stringResult = final.join('').trim()
  // return raw array
  if (returnList) {
    return stringResult
      .split(splitChar)
      .filter(x => !!x.length)
      .map(part => `...${part}...`)
  }
  stringResult = stringResult.replace(splitChar, ' ... ')
  if (stringResult.length) {
    return stringResult
  }
  return text.length < maxChars
    ? text
    : text.replace(/(\s{2,}|\n)/g, separator).slice(0, maxChars - 3) + '...'
}
