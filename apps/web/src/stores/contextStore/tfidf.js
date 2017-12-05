import { countBy, memoize, flatten } from 'lodash'

export default docs => {
  console.log('called tfidf with ', docs.length, 'docs')
  const terms = countBy(flatten(docs))

  const idf = t => {
    const val = docs.length / (terms[t] || 0)

    if (val === Infinity) return 0
    return val
  }

  // window._terms = terms

  const getVal = memoize((key, doc) => {
    const docTerms = countBy(doc)
    const val = doc
      .map(term => ({
        term,
        rank: (docTerms[term] || 0) * idf(term),
      }))
      .filter(t => t.rank > 0)
    return val
  })

  return doc => getVal(doc.join('--'), doc)
}
