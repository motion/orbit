const dot = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    throw new Error('Not same length arrays for dot product')
  }
  const len = a.length
  let sum = 0
  for (let i = 0; i < len; i++) {
    sum += a[i] * b[i]
  }
  return sum
}

const l2norm = (list: number[]) => {
  const len = list.length
  let t = 0
  let s = 1
  let r, val, abs, i
  for (i = 0; i < len; i++) {
    val = list[i]
    abs = val < 0 ? -val : val
    if (abs > 0) {
      if (abs > t) {
        r = t / val
        s = 1 + s * r * r
        t = abs
      } else {
        r = val / t
        s = s + r * r
      }
    }
  }
  return t * Math.sqrt(s)
}

const cosineSimilarity = (a, b) => {
  return dot(a, b) / (l2norm(a) * l2norm(b))
}

export function cosineDistance(a, b) {
  const res = cosineSimilarity(a, b)
  return res !== null ? 1 - res : res
}
