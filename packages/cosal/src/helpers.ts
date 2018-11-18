import { Vector } from '@mcro/vectorious'
import { memoize, random, sortBy, reverse } from 'lodash'

export const defaultSlang = {
  dont: 'don\'t',
  yea: 'yes',
  ya: 'yes',
  nope: 'no',
  wont: 'won\'t',
  wouldnt: 'wouldn\'t',
  hes: 'he\'s',
  shes: 'she\'s',
}

export const getWordVector = memoize(
  (word: string, vectors): number[] => {
    word = word
      .replace('.', '')
      .replace(';', '')
      .replace(',', '')
      .toLowerCase()
    const randomVector = vectors.hello.map(() => random(-0.15, 0.15))
    const vector = word === 'constructor' ? randomVector : vectors[word] || randomVector
    return vector
  },
)

const cosineSimilarity = ($v1, $v2) => {
  const dot = $v1.dot($v2)
  return dot / ($v1.magnitude() * $v2.magnitude())
}

export const nearestWords = (vec, vectors) => {
  const $vec = new Vector(vec)
  const distances = Object.keys(vectors).map(word => {
    const $wordVec = new Vector(getWordVector(word, vectors))
    const distance = cosineSimilarity($vec, $wordVec)
    return { word, distance }
  })
  return reverse(sortBy(distances, 'distance')).slice(0, 4)
}

export const docVec = (pairs, vectors) => {
  let $vec = new Vector(vectors.hello.map(() => 0))
  pairs.forEach(({ string, weight }) => {
    const $wordVec = new Vector(getWordVector(string.toLowerCase(), vectors))
    $vec = $vec.add($wordVec.scale(weight * weight))
  })
  return $vec
}

export function toWords(s: string): string[] {
  return s
    .replace(/&amp;/g, '')
    .replace(/’/g, '\'')
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    .replace(/<.*>/g, '')
    .replace(/[^'.,;őa-z0-9]/gi, ' ')
    .replace(/.,;$/g, ' ')
    .split(' ')
    .filter(w => w.trim().length > 0)
}

export function sigmoid(x) {
  const horizontal = 8.6
  const vertical = 0.784
  return (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5
}
