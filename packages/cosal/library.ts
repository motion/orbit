import corpusCovar from './corpusCovar'
import harmonicMean from './harmonicMean'
import { inv } from 'mathjs'
import { memoize, range, random, sum } from 'lodash'
import { Doc, Cosal } from './types'
import { tensor } from 'propel'

//const vecFile = path.join(__filename, '../../../data/vecs.json')
// const vectors = JSON.parse(readFileSync(vecFile, 'utf8'))
const vectors = {}
const horizontal = 8.6
const vertical = 0.784

const corpusCovarInverse = tensor(inv(corpusCovar))

const ourSigmoid = (x, horizontal, vertical) =>
  (1 / (1 + Math.exp((-x + 0.5) * horizontal)) - 0.5) * vertical + 0.5

const getWordVector = memoize(word =>
  tensor([vectors[word] || vectors['hello'].map(() => random(-0.05, -0.05))]),
)

const getDistance = async (word, vector) => {
  if (distanceCache[word]) return distanceCache[word]
  const val = (await distance(vector).data())[0]
  distanceCache[word] = val
  return val
}

const toWords = s =>
  s
    .replace(/[^a-z0-9]/gi, ' ')
    .split(' ')
    .filter(w => w.trim().length > 0)

// words to distance
const distanceCache = {}
const distance = vector =>
  vector
    .matmul(corpusCovarInverse)
    .matmul(vector.transpose())
    .sqrt()

export async function toCosal(doc: Doc): Promise<Cosal> {
  const words = toWords(doc.fields[0].content.toLowerCase())
  const allWordVectors = words.map(getWordVector)

  let allDistances: any = await Promise.all(
    words.map((word, index) => getDistance(word, allWordVectors[index])),
  )

  if (allDistances.length > 1) {
    const maxDistance = Math.max.apply(null, allDistances)
    allDistances = allDistances.map(d => (d > 0 ? d : maxDistance))

    const mean = harmonicMean(allDistances)

    allDistances = allDistances
      .map(d => d / (2 * mean))
      .map(d => ourSigmoid(d, horizontal, vertical))
  } else {
    allDistances = [1]
  }
  const weights = allDistances

  let vector = tensor([range(100).map(() => 0)])

  allWordVectors.forEach((vec, index) => {
    const weight = weights[index]
    vector = vector.add(vec.mul(tensor(weight)))
  })
  vector = vector.div(tensor(sum(weights)))
  vector = Array.from(await vector.data())

  const pairs = words.map((word, index) => ({ word, weight: weights[index] }))
  const fields = doc.fields.map(({ content, weight }) => ({
    content,
    weight,
    words: pairs,
  }))

  // add new fields and vector to doc
  return { ...doc, fields, vector }
}

export async function mCosSimilarities(vec1, vec2s) {
  vec1 = tensor([vec1])
  const c1 = distance(vec1)
  const top = c1.square()

  return await Promise.all(
    vec2s.map(async vec2 => {
      vec2 = tensor([vec2])
      const c2 = distance(vec2)

      const newTop = top.add(c2.square()).sub(distance(vec1.sub(vec2)).square())

      const bottom = c1.matmul(c2).mul(tensor(2))
      return (await newTop.div(bottom).data())[0]
    }),
  )
}

export async function mCosSimilarity(vec1, vec2) {
  vec1 = vec1.toJS()
  vec2 = vec2.toJS()
  vec1 = tensor([vec1])
  vec2 = tensor([vec2])
  const c1 = distance(vec1)
  const c2 = distance(vec2)
  const top = c1
    .square()
    .add(c2.square())
    .sub(distance(vec1.sub(vec2)).square())
  const bottom = c1.matmul(c2).mul(tensor(2))
  return (await top.div(bottom).data())[0]
}
