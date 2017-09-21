import stopwords from './stopwords'
import { orderBy } from 'lodash'

const noStop = word => !stopwords[word] && word.length > 0
const termFreq = doc => {
  const freq = {}

  doc
    .split(' ')
    .filter(noStop)
    .map(i => i.toLowerCase())
    .forEach(word => {
      if (!freq[word]) freq[word] = 0
      freq[word] += 1
    })

  return freq
}

const docsFreq = docs => {
  const all = {}
  docs.map(termFreq).forEach(freqs => {
    Object.keys(freqs).map(word => {
      if (!all[word]) all[word] = 0
      all[word] += freqs[word]
    })
  })
  console.log('all', Object.keys(all).length)

  return all
}

export default (docsA, docsB) => {
  const freqs = docsFreq(docsA)
  const vals = {}
  console.log('freqs are', freqs)

  docsB
    .join(' ')
    .split(' ')
    .filter(noStop)
    .map(i => i.toLowerCase())
    .forEach(word => {
      vals[word] = vals[word] || 0
      vals[word] += freqs[word]
    })

  console.log('vals', vals)

  return orderBy(
    Object.keys(vals).map(word => {
      return { word, val: vals[word] }
    }),
    'val',
    'desc'
  ).map(i => i.word)
}
