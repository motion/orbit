import {
  memoize,
  reverse,
  min,
  countBy,
  flatten,
  includes,
  sortBy,
  sum,
} from 'lodash'
import { watch, store } from '@mcro/black'
import { Thing } from '~/app'
import tfidf from './tfidf'
import stopwords from './stopwords'

const vectorsFile = `/vectors15k.txt`

// alphanumeric and spacse
const cleanText = s => {
  if (s.toLowerCase) {
    return s.toLowerCase().replace(/[^0-9a-zA-Z\ ]/g, '')
  } else {
    console.log('s is', s)
    return ''
  }
}

let vectorCache = null

@store
export default class Context {
  // out of vocabulary words, a map of word -> count
  vectors = null
  items = Thing.find()

  @watch
  tfidf = () =>
    this.items &&
    !this.loading &&
    tfidf((this.items || []).map(item => this.textToWords(item.title)))

  @watch oov = () => this.items && this.vectors && this.getOov()

  get loading() {
    if (Object.keys(this.oov || {}).length < 5) return true
    return this.vectors === null
  }

  // prepatory
  onLoad = () =>
    new Promise(resolve => {
      const clearId = setInterval(() => {
        if (!this.loading) {
          clearInterval(clearId)
          resolve()
        }
      }, 100)
    })

  constructor() {
    this.load()
  }

  load = async () => {
    this.vectors = await this.getVectors()
  }

  getVectors = async () => {
    if (vectorCache) return vectorCache
    const text = await (await fetch(vectorsFile)).text()

    const vectors = {}
    text.split('\n').forEach(line => {
      const split = line.split(' ')
      const word = split[0]
      const vsList = new Uint16Array(
        split.slice(1).map(i => Math.floor(+i * 100))
      )
      vectors[word] = vsList
    })

    vectorCache = vectors

    return vectors
  }

  getOov() {
    // our vector space has some simple holes
    const wordMap = {
      couldnt: 'cannot',
      doesnt: 'dont',
    }

    const counts = countBy(
      flatten(
        (this.items || []).map(item =>
          cleanText(item.title)
            .split(' ')
            .map(i => wordMap[i] || i)
            // there are some words like "constructor" that behave weirdly
            .filter(i => typeof i === 'string' && !this.vectors[i])
        )
      )
    )
    return counts

    return Object.keys(counts).reduce((acc, item) => {
      if (counts[name] > 2) return { ...acc, [item]: counts[name] }
      return acc
    }, {})
  }

  // calculations

  textToWords = memoize(text => {
    return cleanText(text)
      .split(' ')
      .filter(
        w =>
          w.length > 0 &&
          !includes(stopwords, w) &&
          (w in this.vectors || this.oov[w])
      )
  })

  wordDistance = memoize((key, w, w2) => {
    // if out of vocab, we can't compare in vector space
    // Penalize 300 if other doc doesn't contain
    if (this.oov[w] || this.oov[w2]) {
      if (w === w2) return 0
      return 300
    }

    const v = this.vectors[w]
    const v2 = this.vectors[w2]
    return Math.sqrt(
      sum(v.map((_, index) => Math.pow(Math.abs(v[index] - v2[index]), 2)))
    )
  })

  wordsDistance = (ws, ws2) => {
    return sum(
      ws.map(w => min(ws2.map(w2 => this.wordDistance(w + '-' + w2, w, w2))))
    )
  }

  textToImportantWords = text => {
    return reverse(sortBy(this.tfidf(this.textToWords(text)), 'rank'))
      .slice(0, 5)
      .map(({ term }) => term)
  }

  closestItems = (text, n = 5) => {
    const words = this.textToWords(text)

    const items = (this.items || []).map(item => ({
      similarity: this.wordsDistance(words, this.textToWords(item.title)),
      item,
    }))

    return sortBy(items, 'similarity').slice(0, n)
  }
}
