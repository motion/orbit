import corpusCovar from './corpusCovar'
import harmonicMean from './harmonicMean'
import { inv } from 'mathjs'
import { memoize, range, random, sum, flatten } from 'lodash'
import { Doc, Cosal } from './types'
import { Matrix, Vector } from 'vectorious/withoutblas'
import computeCovariance from 'compute-covariance'

import mostCommonText from './commonWords'
const isCommonWord = mostCommonText
  .split('\n')
  .slice(0, 100)
  .reduce((acc, item) => ({ ...acc, [item]: true }), {})

// @ts-ignore
const vectors = require('../vecs.json')
// import vectors from '../vecs.json'

//const vecFile = path.join(__filename, '../../../data/vecs.json')
// const vectors = JSON.parse(readFileSync(vecFile, 'utf8'))
const horizontal = 8.6
const vertical = 0.784

const docCov = null
let corpusCovarInverse = new Matrix(inv(corpusCovar))

const ourSigmoid = (x, horizontal, vertical) =>
  (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5

const getWordVector = memoize(
  word =>
    new Vector(
      vectors[word] || vectors['hello'].map(() => random(-0.05, 0.05)),
    ),
)

const getDistance = async (word, vector) => {
  if (distanceCache[word]) return distanceCache[word]
  const val = distance(vector)
  distanceCache[word] = val
  return val
}

const toWords = s =>
  s
    .replace(/[^a-z0-9]/gi, ' ')
    .split(' ')
    .filter(w => w.trim().length > 0)

// words to distance
const distanceCache = {}
const distance = vector => {
  let m = new Matrix([vector.data])

  return Math.sqrt(
    m
      .multiply(corpusCovarInverse)
      .multiply(m.transpose())
      .toArray()[0][0],
  )
}

export async function toCosal(doc: Doc): Promise<Cosal> {
  const words = toWords(doc.fields[0].content.toLowerCase())
  const allWordVectors = words.map(getWordVector)

  let allDistances: any = await Promise.all(
    words.map((word, index) => getDistance(word, allWordVectors[index])),
  )

  if (allDistances.length > 1) {
    const maxDistance = Math.max.apply(null, allDistances)
    allDistances = allDistances.map(d => (d > 0 ? d : maxDistance))

    const mean = harmonicMean(allDistances)

    allDistances = allDistances
      .map(d => d / (2 * mean))
      .map(d => ourSigmoid(d, horizontal, vertical))
  } else {
    allDistances = [1]
  }
  const weights = allDistances

  let vector = new Vector(range(100).map(() => 0))

  allWordVectors.forEach((vec, index) => {
    const weight = weights[index]
    vector = vector.add(vec.scale(weight))
  })
  vector = vector.scale(1 / sum(weights))
  vector = vector.toArray()

  const pairs = words.map((word, index) => ({ word, weight: weights[index] }))
  const fields = doc.fields.map(({ content, weight }) => ({
    content,
    weight,
    words: pairs,
  }))

  // add new fields and vector to doc
  return { ...doc, fields, vector }
}

export function getCovariance(docs) {
  const words = flatten(
    docs.map(doc => toWords(doc.fields[0].content.toLowerCase())),
  )

  const vectors = words
    .filter(word => !isCommonWord[word])
    .map(getWordVector)
    .map(v => v.toArray())

  const transposed = new Matrix(vectors).transpose().toArray()
  const docCov = new Matrix(computeCovariance(transposed))
  const corpusCovarMatrix = new Matrix(corpusCovar)
  const totalCovar = corpusCovarMatrix.product(docCov).toArray()
  // const covarPrime = .sign(corpusCovar) * (abs(docCovar) * p + abs(corpCovar) * (1 - p))
  corpusCovarInverse = new Matrix(inv(totalCovar))
}

export async function mCosSimilarities(vec1, vec2s) {
  const v1 = new Vector(vec1)
  return vec2s.map(vec2 => {
    const v2 = new Vector(vec2)
    return v1.dot(v2) / (v1.magnitude(2) * v2.magnitude(2))
  })
}
/*
export async function mCosSimilarities(vec1, vec2s) {
  vec1 = new Vector(vec1)
  const d1 = distance(vec1)

  return await Promise.all(
    vec2s.map(async vec2 => {
      vec2 = new Vector(vec2)
      const d2 = distance(vec2)
      const top = d1 * d1 + d2 * d2 - Math.pow(distance(vec1.subtract(vec2)), 2)
      const bottom = 2 * d1 * d2
      console.log('top is', top, 'bottom is', bottom)
      return top / bottom
    }),
  )
}
*/
