import { range, sortBy, memoize, sum } from 'lodash'

export const cosineSimilarity = memoize((key, v, v2) => {
  const r = range(v.length)

  const top = sum(r.map(i => v[i] * v2[i]))
  const l2 = vec => Math.sqrt(sum(r.map(i => Math.pow(vec[i], 2))))
  const bottom = l2(v) * l2(v2)
  return top / bottom
})

export const euclideanDistance = memoize((key, v, v2) => {
  return Math.sqrt(sum(v.map((_, index) => Math.pow(v[index] - v2[index], 2))))
})

export const emd = (words, words2, weights, vecs) => {
  let total = 0
  words.forEach((w, vIndex) => {
    let minVal = Infinity
    let minIndex = null

    words2.forEach((w2, index) => {
      const val = euclideanDistance(w + ':' + w2, vecs[w], vecs[w2])
      if (val < minVal) {
        minVal = val
        minIndex = index
      }
    })

    // removes the element at index minIndex
    words2.splice(minIndex, 1)
    total += minVal * weights[vIndex]
  })
  return total
}

export const splitSentences = s =>
  s
    .replace(/\\n/g, '. ')
    .replace(/\[(.*?)\]/g, '')
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .filter(s => s.length > 10)

export const minKBy = (vals, k, fn) => {
  let stash = []
  let min = Infinity

  vals.forEach(item => {
    const val = fn(item)
    if (val < min) {
      if (stash.length < k) {
        stash.push(item)
      } else {
        stash = sortBy(stash, fn)
        min = fn(stash[stash.length - 1])
        stash[stash.length - 1] = item
      }
    }
  })

  return sortBy(stash, fn)
}
