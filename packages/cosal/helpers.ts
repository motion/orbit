import mostCommonText from './commonWords'
import { memoize, random } from 'lodash'

const vectors = require('../vecs.json')

const slang = {
  dont: `don't`,
  yea: 'yes',
  ya: 'yes',
  nope: 'no',
  wont: `won't`,
  wouldnt: `wouldn't`,
  hes: `he's`,
  shes: `she's`,
}

Object.keys(slang).forEach(word => {
  vectors[word] = vectors[slang[word]]
})

export const getWordVector = memoize(
  word => vectors[word] || vectors['hello'].map(() => random(-0.15, 0.15)),
)

export const isCommonWord = mostCommonText
  .split('\n')
  .slice(0, 100)
  .reduce((acc, item) => ({ ...acc, [item]: true }), {})

export function toWords(s) {
  return s
    .replace(/’/g, "'")
    .replace(/\<.*\>/g, '')
    .replace(/[^\'a-z0-9]/gi, ' ')
    .split(' ')
    .filter(w => w.trim().length > 0)
}

export function sigmoid(x) {
  const horizontal = 8.6
  const vertical = 0.784
  return (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5
}
