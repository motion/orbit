import { flatten } from 'lodash'

const splitChar = '🂓'

const notLetter = /[^A-Za-z0-9 ]+/g
const cutoff = (str, maxChars) => {
  if (str.length <= maxChars) {
    return str
  }
  return str.replace(/(\s{2,}|\n)/g, ' ').slice(0, maxChars - 3) + '...'
}

export type HighlightOptions = {
  text: string
  words: string[]
  trimWhitespace?: boolean
  maxChars?: number
  maxSurroundChars?: number
  style?: string
  separator?: string
  noSpans?: boolean
}

const isHighlightWord = (str, words) => {
  if (!str) {
    return false
  }
  for (const word of words) {
    if (str.length !== word.length) {
      continue
    }
    if (str.toLowerCase() === word) {
      return true
    }
  }
  return false
}

// cut text down using highlight words
// not a wonderfully efficient
// but still great for not too long text
// and pretty easy to follow
export function highlightText(options: HighlightOptions): string {
  const {
    text,
    trimWhitespace,
    maxChars = 500,
    maxSurroundChars = 50,
    style = 'background: rgba(255, 255, 0, 0.75); color: #111; border-radius: 3px;',
    separator = '&nbsp;&middot;&nbsp;',
  } = options

  if (!options.words) {
    return cutoff(text, maxChars).trim()
  }

  // lowercase needle
  let parts = [text]
  // lowercase haystack
  const words = options.words.map(x => x.toLowerCase())
  if (trimWhitespace) {
    parts[0] = parts[0].replace(/(\s{2,}|\n)/g, splitChar)
  }
  const wordFinders = words.map(word => new RegExp(`(${word.replace(notLetter, '')})`, 'gi'))
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

  // trim it down
  const filtered: string[] = []
  let prev
  for (const [index, part] of parts.entries()) {
    const highlighted = isHighlightWord(part, words)
    const prevHighlighted = prev
    prev = highlighted
    if (highlighted) {
      filtered.push(part)
      continue
    }
    const nextHighlighted = isHighlightWord(parts[index + 1], words)
    // if not close, ignore
    if (!prevHighlighted && !nextHighlighted) {
      continue
    }
    const midChar = (filtered.length && splitChar) || ''
    if (prevHighlighted && !nextHighlighted) {
      if (part.length > surroundMax) {
        filtered.push(part.slice(0, surroundMax)) + midChar
      } else {
        filtered.push(part)
      }
      continue
    }
    if (!prevHighlighted && nextHighlighted) {
      if (part.length > surroundMax) {
        filtered.push(midChar + part.slice(part.length - surroundMax))
      } else {
        filtered.push(part)
      }
      continue
    }
    if (prevHighlighted && nextHighlighted) {
      if (part.length > surroundMax * 2) {
        filtered.push(part.slice(0, surroundMax) + midChar + part.slice(part.length - surroundMax))
      } else {
        filtered.push(part)
      }
    }
  }

  let final: string[] = []
  let len = 0
  for (const part of filtered) {
    // this does our maxChars filtering, but wont chop last line...
    len += part.length
    if (len > maxChars) {
      continue
    }
    if (words.indexOf(part.toLowerCase()) === 0 && options.noSpans !== true) {
      final.push(`<span style="${style}">${part}</span>`)
    } else {
      final.push(part)
    }
  }

  console.log('hltext', options, text, final)

  let stringResult = final.join('').replace(splitChar, separator)

  if (stringResult.length) {
    return stringResult.trim()
  }

  // no result, do a simple cutoff
  return cutoff(text, maxChars).trim()
}
