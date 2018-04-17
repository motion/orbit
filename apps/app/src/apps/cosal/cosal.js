import * as tf from '@tensorflow/tfjs'
import corpusCovar from './corpusCovar'
import harmonicMean from './harmonicMean'
import { inv } from 'mathjs'
import { memoize, range, random, sum } from 'lodash'
// import allCommonWords from './commonWords'
// const commonWords = allCommonWords.split('\n')

const { setBackend, scalar, tensor2d } = tf

// tf.ENV.set('DEBUG', true)

window.tfjs = tf

setBackend('cpu')

const vectorUrl = `/dist/vectors.json`
const horizontal = 8.6
const vertical = 0.784

const corpusCovarInverse = tensor2d(inv(corpusCovar))
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const ourSigmoid = (x, horizontal, vertical) =>
  (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5

const getWordVector = memoize(word =>
  tensor2d([vectors[word] || vectors['hello'].map(() => random(-0.05, -0.05))]),
)

const getDistance = async (word, vector) => {
  if (distanceCache[word]) return distanceCache[word]
  const val = (await distance(vector).data())[0]
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
const distance = vector =>
  vector
    .matMul(corpusCovarInverse)
    .matMul(vector.transpose())
    .sqrt()

let vectors = null
let loadingVectors = false
export const loadVectors = async () => {
  if (!loadingVectors) {
    vectors = await (await fetch(vectorUrl)).json()
    /*
    await Promise.all(
      commonWords
        .slice(0, 3000)
        .map(word => getDistance(word, getWordVector(word))),
    )
    */
    loadingVectors = true
  }

  while (!vectors) {
    await sleep(150)
  }

  return vectors
}

export async function processDocument(content) {
  await loadVectors()
  const words = toWords(content.toLowerCase())
  const allWordVectors = words.map(getWordVector)

  let allDistances = await Promise.all(
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

  const pairs = words.map((word, index) => ({ word, weight: weights[index] }))
  const closest = []

  let vector = tensor2d([range(100).map(() => 0)])

  allWordVectors.forEach((vec, index) => {
    const weight = weights[index]
    vector = vector.add(vec.mul(scalar(weight)))
  })
  vector = vector.div(scalar(sum(weights)))
  vector = Array.from(await vector.data())

  return { words: pairs, vector, closest }
}

export async function mCosSimilarities(vec1, vec2s) {
  vec1 = tensor2d([vec1])
  const c1 = distance(vec1)
  const top = c1.square()

  return await Promise.all(
    vec2s.map(async vec2 => {
      vec2 = tensor2d([vec2])
      const c2 = distance(vec2)

      const newTop = top.add(c2.square()).sub(distance(vec1.sub(vec2)).square())

      const bottom = c1.matMul(c2).mul(scalar(2))
      return (await newTop.div(bottom).data())[0]
    }),
  )
}

export async function mCosSimilarity(vec1, vec2) {
  vec1 = vec1.toJS()
  vec2 = vec2.toJS()
  vec1 = tensor2d([vec1])
  vec2 = tensor2d([vec2])
  const c1 = distance(vec1)
  const c2 = distance(vec2)
  const top = c1
    .square()
    .add(c2.square())
    .sub(distance(vec1.sub(vec2)).square())
  const bottom = c1.matMul(c2).mul(scalar(2))
  return (await top.div(bottom).data())[0]
}
