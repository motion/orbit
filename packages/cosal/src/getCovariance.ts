import computeCovariance from 'compute-covariance'
import { toWords, getWordVector, vectors } from './helpers'
import { Matrix } from '@mcro/vectorious'

export type WeightedDocument = {
  doc: string
  weight: number
}

export type Covariance = {
  hash: string
  matrix: Matrix
}

function docToCovar(doc: string): Matrix {
  const val = toWords(doc.toLowerCase())
    .filter(word => vectors[word])
    .map(getWordVector)
  if (val.length === 0) {
    return false
  }
  const matrix = new Matrix(val)
  const covar = computeCovariance(matrix.transpose().toArray())
  return new Matrix(covar)
}

let index = 0

export function getCovariance(
  existingCovariance: number[][] = corpusCovarPrecomputed,
  docs: WeightedDocument[] = [],
  corpusWeight = 1,
): Covariance | null {
  let matrix = new Matrix(existingCovariance).scale(corpusWeight)
  for (const { weight, doc } of docs) {
    const dc = docToCovar(doc)
    if (!dc) {
      console.log('No document covar')
      continue
    }
    matrix = matrix.add(dc.scale(weight))
  }
  const inversed = matrix.inverse().toArray()
  return {
    hash: `index${index++ % Number.MAX_SAFE_INTEGER}`,
    matrix: inversed,
  }
}
