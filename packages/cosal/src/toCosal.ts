import harmonicMean from './harmonicMean'
import { range, sum } from 'lodash'
import { toWords, sigmoid, getWordVector } from './helpers'
import { Matrix, Vector } from '@mcro/vectorious'
import { Covariance } from './getCovariance'

export { getCovariance } from './getCovariance'

export type Weight = {
  string: string
  weight: number
}

export type Cosal = {
  vector: number
  pairs: Weight[]
}

const distanceCache = {}
const zeros = range(100).map(() => 0)

const distance = (vector, inverseCovar: Covariance) => {
  const vec = new Matrix([vector])
  const icMatrix = new Matrix(inverseCovar.matrix)
  const val1 = vec.multiply(icMatrix)
  return Math.sqrt(val1.multiply(vec.transpose()).toArray()[0])
}

const getDistance = (string, vector, inverseCovar: Covariance): number => {
  const key = `${string}-${inverseCovar.hash}`
  if (distanceCache[key]) {
    return distanceCache[key]
  }
  distanceCache[key] = distance(vector, inverseCovar)
  return distanceCache[key]
}

// words to distance

export async function toCosal(text: string, inverseCovar: Covariance): Promise<Cosal | null> {
  const words = toWords(text)

  if (words.length === 0) {
    return null
  }

  const wordVectors = words.map(getWordVector)

  let distances = words.map((word, i) => getDistance(word, wordVectors[i], inverseCovar))
  if (distances.length > 1) {
    const maxDistance = Math.max.apply(null, distances)
    distances = distances.map(d => (d > 0 ? d : maxDistance))
    const mean = harmonicMean(distances)
    distances = distances.map(d => sigmoid(d / (2 * mean)))
  } else {
    distances = [1]
  }

  let vector = new Vector(zeros)
  for (const [index, wordVector] of wordVectors.entries()) {
    const weight = distances[index]
    vector = vector.add(new Vector(wordVector.vector).scale(weight))
  }
  const scaledVector = vector.scale(1 / sum(distances)).toArray()

  const pairs = wordVectors.map(({ string }, index) => ({
    string: `${string}`,
    weight: +distances[index],
  }))

  return { vector: scaledVector, pairs }
}
