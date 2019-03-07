import { Matrix } from '@o/vectorious'
import computeCovariance from 'compute-covariance'
import { VectorDB } from './cosal'
import { getWordVector, toWords } from './helpers'

export type WeightedDocument = {
  doc: string
  weight: number
}

export type Covariance = {
  hash: string
  matrix: Matrix
}

function docToCovar(doc: string, vectors: VectorDB, fallbackVector): Matrix {
  const val = toWords(doc).map(res => getWordVector(res.normalized, vectors, fallbackVector))
  if (val.length === 0) {
    return false
  }
  const matrix = new Matrix(val)
  const covar = computeCovariance(matrix.transpose().toArray())
  return new Matrix(covar)
}

let index = 0

export function getIncrementalCovariance(
  existingCovariance: number[][],
  docs: WeightedDocument[] = [],
  corpusWeight = 1,
  vectors: VectorDB,
  fallbackVector,
): Covariance | null {
  let matrix = new Matrix(existingCovariance).scale(corpusWeight)
  for (const { weight, doc } of docs) {
    const dc = docToCovar(doc, vectors, fallbackVector)
    if (!dc) {
      continue
    }
    matrix = matrix.add(dc.scale(weight))
  }
  return {
    hash: `index${index++ % Number.MAX_SAFE_INTEGER}`,
    matrix: matrix.inverse().toArray(),
  }
}
