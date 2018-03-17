import { sortBy, last, flatten, range, sum } from 'lodash'

export const minKBy = (vals, k, fn) => {
  let stash = []
  let min = Infinity

  vals.forEach(item => {
    const val = fn(item)
    if (stash.length < k) {
      stash = sortBy([...stash, item], fn)
      min = fn(last(stash))
    } else {
      if (val < min) {
        stash[stash.length - 1] = item
        stash = sortBy(stash, fn)
        min = fn(last(stash))
      }
    }
  })

  return sortBy(stash, fn)
}

export const isAlphaNum = s => /^[a-z0-9]+$/i.test(s)

export const vectorsToCentroid = (vecs, embedding) => {
  const zeros = range(embedding.dimensionality).map(() => 0)
  const addVec = (v, v2, weight) => {
    const val = v.map((val, index) => val + (v2[index] - val) * weight)
    return val
  }

  return vecs.reduce((accVec, { vec, weight }) => {
    return addVec(accVec, vec, weight)
  }, zeros)
}

// { foo: 2, bar: 5 } + { foo: 1 } = { foo: 3, bar: 5 }
export const sumCounts = xs => {
  const total = {}

  xs.forEach(x => {
    Object.keys(x).forEach(key => {
      if (!total[key]) {
        total[key] = 0
      }

      total[key] += x[key]
    })
  })

  return total
}

export const cosineSimilarity = (v, v2) => {
  const r = range(v.length)

  const top = sum(r.map(i => v[i] * v2[i]))
  const l2 = vec => Math.sqrt(sum(r.map(i => Math.pow(vec[i], 2))))
  const bottom = l2(v) * l2(v2)
  return top / bottom
}

export const cosineSimilarities = (v, v2) => {
  const totals = flatten(v.map(_v => v2.map(_v2 => cosineSimilarity(_v, _v2))))
  return sum(totals)
}

export const splitSentences = s =>
  s
    .replace(/\\n/g, '. ')
    .replace(/\[(.*?)\]/g, '')
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .filter(s => s.length > 10)

export const wordMoversDistance = (vecs, vecs2) => {
  const list = []

  let total = 0
  vecs.forEach(vec => {
    let minVal = Infinity
    let minIndex = null

    vecs2.forEach((vec2, index) => {
      let val = 1

      // if they're the same, don't bother going to the vector space
      val = 1 - cosineSimilarity(vec, vec2)

      if (val < minVal) {
        minVal = val
        minIndex = index
      }
    })

    // removes the element at index minIndex
    list.push(minVal)
    vecs2.splice(minIndex, 1)
    total += minVal
  })

  return { total, list }
}
