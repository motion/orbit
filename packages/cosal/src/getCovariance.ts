import corpusCovarPrecomputed from './corpusCovar'
import computeCovariance from 'compute-covariance'
import { toWords, getWordVector, vectors } from './helpers'
import { Matrix } from '@mcro/vectorious'

export type Convariance = {
  hash: string
  matrix: number[][]
}

const corpusCovar = {
  hash: 'corpus',
  matrix: corpusCovarPrecomputed,
}

const docToCovar = doc => {
  const val = toWords(doc.toLowerCase())
    .filter(word => vectors[word])
    .map(getWordVector)

  if (val.length === 0) {
    return false
  }

  const $matrix = new Matrix(val)
  const covar = computeCovariance($matrix.transpose().toArray())
  return new Matrix(covar)
}

let index = 0

// getInverseCovariance
export function getCovariance(docs = [], corpusWeight = 1): Convariance | null {
  let $matrix = new Matrix(corpusCovar.matrix).scale(corpusWeight)
  for (const { weight, doc } of docs) {
    const $doc = docToCovar(doc)
    if (!$doc) {
      return null
    }
    $matrix = $matrix.add($doc.scale(weight))
  }
  const inversed = $matrix.inverse().toArray()
  return {
    hash: `index${index++}`,
    matrix: inversed,
  }
}
