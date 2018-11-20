import computeCovariance from 'compute-covariance'
import { VectorDB } from './cosal'

export const getCovariance = (vectors: VectorDB) => {
  const words = Object.keys(vectors)
  const rowLen = vectors[words[0]].length
  if (!Array.isArray(vectors[words[0]])) {
    console.log('bad line', words[0], vectors[words[0]])
    throw new Error('Vectors must be array of numbers')
  }

  let matrix = []
  for (let r = 0; r < rowLen; r++) {
    matrix[r] = []
    for (const [i, word] of words.entries()) {
      matrix[r][i] = vectors[word][r]
    }
  }

  const res = computeCovariance(...matrix /* , { bias: true } */)
  return res
}
