import { Matrix, Vector } from '@o/vectorious'
import { range, sum, uniqBy } from 'lodash'
import { VectorDB } from './cosal'
import { Covariance } from './getIncrementalCovariance'
import harmonicMean from './harmonicMean'
import { getWordVector, sigmoid, toWords } from './helpers'

export { getIncrementalCovariance } from './getIncrementalCovariance'

export type Pair = {
  string: string
  weight: number
}

export type CosalDocument = {
  vector: number[]
  pairs: Pair[]
}

const distanceCache = {}
const zeros = range(100).map(() => 0)

const distance = (vector, inverseCovar: Covariance) => {
  const matrix = new Matrix([vector])
  const icMatrix = new Matrix(inverseCovar.matrix)
  const val1 = matrix.multiply(icMatrix)
  return Math.sqrt(val1.multiply(matrix.transpose()).toArray()[0])
}

const getDistance = (string: string, vector: number[], inverseCovar: Covariance): number => {
  const key = `${string}-${inverseCovar.hash}`
  if (distanceCache[key]) {
    return distanceCache[key]
  }
  if (vector.length !== inverseCovar.matrix[0].length) {
    throw new Error(
      `We got a weird on ${string} ${vector.length} !== ${inverseCovar.matrix[0].length}`,
    )
  }
  distanceCache[key] = distance(vector, inverseCovar)
  return distanceCache[key]
}

// words to distance

export async function toCosal(
  text: string,
  inverseCovar: Covariance,
  vectors: VectorDB,
  fallbackVector,
  options?: { uniqueWords?: boolean },
): Promise<CosalDocument | null> {
  let words = toWords(text)

  if (words.length === 0) {
    return null
  }

  // unique on the "normalized" word
  if (options && options.uniqueWords) {
    words = uniqBy(words, x => x.normalized)
  }

  let wordVectors = words.map(word => getWordVector(word.normalized, vectors, fallbackVector))

  let distances = words.map((word, i) => getDistance(word.normalized, wordVectors[i], inverseCovar))
  if (distances.length > 1) {
    const maxDistance = Math.max.apply(null, distances)
    distances = distances.map(d => (d > 0 ? d : maxDistance))
    const mean = harmonicMean(distances)
    distances = distances.map(d => sigmoid(d / (2 * mean)))
  } else {
    distances = [1]
  }

  let vector = new Vector(zeros)
  let pairs: Pair[] = []

  for (const [index, { word }] of words.entries()) {
    const wordVector = wordVectors[index]
    const weight = distances[index]
    vector = vector.add(new Vector(wordVector).scale(weight))
    pairs.push({ string: word, weight: +distances[index] })
  }

  const scaledVector = vector.scale(1 / sum(distances)).toArray()

  return { vector: scaledVector, pairs }
}
