import corpusCovarPrecomputed from './corpusCovar'
import computeCovariance from 'compute-covariance'
import { toWords, getWordVector, vectors } from './helpers'
import { Matrix } from '@mcro/vectorious'

export type WeightedDocument = {
  doc: string
  weight: number
}

export type Covariance = {
  hash: string
  matrix: number[][]
}

const corpusCovar = {
  hash: 'corpus',
  matrix: corpusCovarPrecomputed,
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

// getInverseCovariance
export function getCovariance(docs: WeightedDocument[] = [], corpusWeight = 1): Covariance | null {
  let matrix = new Matrix(corpusCovar.matrix).scale(corpusWeight)
  for (const { weight, doc } of docs) {
    const dc = docToCovar(doc)
    if (!dc) {
      throw new Error('No document covar')
    }
    matrix = matrix.add(dc.scale(weight))
  }
  const inversed = matrix.inverse().toArray()
  return {
    hash: `index${index++ % Number.MAX_SAFE_INTEGER}`,
    matrix: inversed,
  }
}
