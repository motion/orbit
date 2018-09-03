import corpusCovarPrecomputed from './corpusCovar'
import computeCovariance from 'compute-covariance'
import { toWords, getWordVector, vectors } from './helpers'
import { Matrix } from 'vectorious/withoutblas'
import mathjs from 'mathjs'
const inverseMatrix = mathjs.inv

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

export default function getInverseCovariance(docs = [], corpusWeight = 1) {
  let $matrix = new Matrix(corpusCovar.matrix).scale(corpusWeight)
  for (const { weight, doc } of docs) {
    const $doc = docToCovar(doc)
    if (!$doc) {
      return false
    }
    $matrix = $matrix.add($doc.scale(weight))
  }
  const inversed = inverseMatrix($matrix.toArray())

  return {
    hash: `index${index++}`,
    matrix: inversed,
  }
}
