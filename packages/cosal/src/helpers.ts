import mostCommonText from './commonWords'
import { Vector } from 'vectorious/withoutblas'
import { memoize, random, sortBy, reverse } from 'lodash'
import { readFileSync } from 'fs'
import { join } from 'path'

export const vectors = JSON.parse(readFileSync(join(__dirname, '..', 'vecs.json'), 'utf-8'))

const slang = {
  dont: 'don\'t',
  yea: 'yes',
  ya: 'yes',
  nope: 'no',
  wont: 'won\'t',
  wouldnt: 'wouldn\'t',
  hes: 'he\'s',
  shes: 'she\'s',
}

Object.keys(slang).forEach(word => {
  vectors[word] = vectors[slang[word]]
})

export const getWordVector = memoize(word => {
  word = word
    .replace('.', '')
    .replace(';', '')
    .replace(',', '')
    .toLowerCase()
  console.log(word, vectors['hello'])
  return (vectors[word] || vectors['hello']).map(() => random(-0.15, 0.15))
})

const cosineSimilarity = ($v1, $v2) => {
  const dot = $v1.dot($v2)
  return dot / ($v1.magnitude() * $v2.magnitude())
}

export const nearestWords = vec => {
  const $vec = new Vector(vec)
  const distances = Object.keys(vectors).map(word => {
    const $wordVec = new Vector(getWordVector(word))
    const distance = cosineSimilarity($vec, $wordVec)
    return { word, distance }
  })
  return reverse(sortBy(distances, 'distance')).slice(0, 4)
}

export const docVec = pairs => {
  let $vec = new Vector(vectors['hello'].map(() => 0))
  pairs.forEach(({ string, weight }) => {
    const $wordVec = new Vector(getWordVector(string.toLowerCase()))
    $vec = $vec.add($wordVec.scale(weight * weight))
  })
  return $vec
}

export const isCommonWord = mostCommonText
  .split('\n')
  .slice(0, 100)
  .reduce((acc, item) => ({ ...acc, [item]: true }), {})

export function toWords(s) {
  if (!s.replace) return []

  return s
    .replace(/&amp;/g, '')
    .replace(/’/g, '\'')
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(/<.*>/g, '')
    .replace(/[^'.,;őa-z0-9]/gi, ' ')
    .split(' ')
    .filter(w => w.trim().length > 0)
}

export function sigmoid(x) {
  const horizontal = 8.6
  const vertical = 0.784
  return (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5
}
