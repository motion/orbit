import harmonicMean from './harmonicMean'
import { range, sum } from 'lodash'
import { toWords, sigmoid, getWordVector } from './helpers'
import { Doc, Cosal, Covariance, WordVector } from './types'
import { Matrix, Vector } from 'vectorious/withoutblas'

const distanceCache = {}
const distance = (word: WordVector, inverseCovar: Covariance) => {
  let vec = new Matrix([word.vector])
  const icMatrix = new Matrix(inverseCovar.matrix)
  const val1 = vec.multiply(icMatrix)

  const val = Math.sqrt(val1.multiply(vec.transpose()).toArray()[0])
  return val
}

const getDistance = async (
  word: WordVector,
  inverseCovar: Covariance,
): Promise<number> => {
  const key = `${word.string}-${inverseCovar.hash}`

  if (distanceCache[key]) {
    return distanceCache[key]
  }

  distanceCache[key] = distance(word, inverseCovar)
  return distanceCache[key]
}

// words to distance

const zeros = range(100).map(() => 0)

export async function toCosal(
  doc: Doc,
  inverseCovar: Covariance,
): Promise<Cosal> {
  inverseCovar = Mobx.toJS(inverseCovar)
  const words = toWords(doc.fields[0].content.toLowerCase())

  if (words.length === 0) {
    return null
  }

  const wordVectors: Array<WordVector> = words.map(string => ({
    vector: getWordVector(string),
    string,
  }))

  let distances: any = await Promise.all(
    wordVectors.map(wordVector => getDistance(wordVector, inverseCovar)),
  )

  if (distances.length > 1) {
    const maxDistance = Math.max.apply(null, distances)
    distances = distances.map(d => (d > 0 ? d : maxDistance))
    const mean = harmonicMean(distances)
    distances = distances.map(d => sigmoid(d / (2 * mean)))
  } else {
    distances = [1]
  }

  const weights = distances

  let vector = new Vector(zeros)
  wordVectors.forEach((wordVector, index) => {
    const weight = weights[index]
    vector = vector.add(new Vector(wordVector.vector).scale(weight))
  })
  vector = vector.scale(1 / sum(weights)).toArray()

  const pairs = wordVectors.map(({ string }, index) => ({
    string,
    weight: weights[index],
  }))

  const fields = doc.fields.map(({ content, weight }) => ({
    content,
    weight,
    words: pairs,
  }))

  // add new fields and vector to doc
  return { ...doc, fields, vector }
}

export async function mCosSimilarities(vec1, vec2s) {
  const v1 = new Vector(vec1)
  return vec2s.map(vec2 => {
    const v2 = new Vector(vec2)
    return v1.dot(v2) / (v1.magnitude(2) * v2.magnitude(2))
  })
}
