import { countBy, memoize, flatten } from 'lodash'

export default docs => {
  const terms = countBy(flatten(docs))

  const idf = t => {
    const val = docs.length / (terms[t] || 0)

    if (val === Infinity) return 0
    return val
  }

  window._terms = terms

  const getVal = memoize((key, doc) => {
    const docTerms = countBy(doc)
    const val = doc
      .map(t => ({
        t,
        rank: (docTerms[t] || 0) * idf(t),
      }))
      .filter(t => t.rank > 0)
    return val
  })

  return doc => getVal(doc.join('--'), doc)
}
