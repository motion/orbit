import corpusCovarPrecomputed from './corpusCovar'
import computeCovariance from 'compute-covariance'
import { flatten } from 'lodash'
import { toWords, isCommonWord, getWordVector } from './helpers'
import { Matrix } from 'vectorious/withoutblas'
import { Covariance } from './types'
import mathjs from 'mathjs'
const inverseMatrix = mathjs.inv

const corpusCovar: Covariance = {
  hash: 'corpus',
  matrix: corpusCovarPrecomputed,
}

let index = 0
export default function getInverseCovariance(docs: Array<any>): Covariance {
  const words = flatten(
    docs.map(doc => toWords(doc.fields[0].content.toLowerCase())),
  )

  const vectors = words.filter(word => !isCommonWord[word]).map(getWordVector)

  const transposed = new Matrix(vectors).transpose().toArray()
  const docCov = new Matrix(computeCovariance(transposed))
  const corpusCovarMatrix = new Matrix(corpusCovar.matrix)
  const percentCorpus = 0.8

  const totalCovar = corpusCovarMatrix
    .scale(percentCorpus)
    .add(docCov.scale(1 - percentCorpus))
    .toArray()
  const inversed = inverseMatrix(totalCovar)

  return {
    // allows us to memoized based on invariance
    hash: `index${index++}`,
    matrix: inversed,
  }
}
