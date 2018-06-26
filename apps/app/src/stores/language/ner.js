import { includes, flatten } from 'lodash'
import stopwords from './stopwords'
import { sentences } from './utils'

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

const allStopwords = [...stopwords, ...months]

const isUpper = s => s[0].toUpperCase() === s[0]
const isNumber = s => {
  // 85% would pass otherwise
  s = s.replace(/\%/g, '')
  return +s + '' === s
}

const validEntity = (word, options = { numberOkay: false }) => {
  if (!word) {
    return false
  }

  return (
    isUpper(word) &&
    !includes(allStopwords, word.toLowerCase()) &&
    (options.numberOkay || !isNumber(word))
  )
}

const alphaNumeric = s => s.replace(/[^a-z0-9\']/gi, '')
const isPossessive = s => s.slice(-2) === '\'s' || s.slice(-1) === '\''

const sentenceToEntities = text => {
  let index = 1
  const entities = []
  const words = text.split(' ').map(alphaNumeric)
  while (index < words.length) {
    let word = words[index]

    if (!validEntity(word)) {
      index += 1
      continue
    }

    let lookAhead = 0
    while (++lookAhead) {
      const numberOkay = !isPossessive(words[index + lookAhead - 1])
      if (validEntity(words[index + lookAhead], { numberOkay })) {
        word += ` ${words[index + lookAhead]}`
      } else {
        break
      }
    }

    index += lookAhead

    const noPunc = word.replace(/[\.\;\:\!\?\,]/g, '')

    entities.push(noPunc)
  }

  return entities
}

export default text => flatten(sentences(text).map(sentenceToEntities))
