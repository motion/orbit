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
import tfidf from './tfidf'
import stopwords from './stopwords'
import { cleanText } from '~/helpers'

let vectorCache = null

export default class Context {
  // out of vocabulary words, a map of word -> count
  vectors = null
  oov = null

  tfidf = items =>
    !this.loading &&
    tfidf(
      (items || []).map(item =>
        this.textToWords(item.title + ' ' + item.body || '')
      )
    )

  constructor(items) {
    this.items = items
    this.start()
  }

  async start() {
    this.vectors = await this.getVectors()
    this.oov = this.getOov()
  }

  get loading() {
    return !this.oov || this.vectors === null
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

  getVectors = async () => {
    if (vectorCache) {
      return vectorCache
    }
    const text = await fetch(`/vectors15k.txt`).then(res => res.text())
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
    // Penalize the diff between onion and beach if other doc doesn't contain
    if (this.oov[w] || this.oov[w2]) {
      if (w === w2) return 0
      return this.wordDistance('base', 'onion', 'beach')
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

  closestItems = (text, n = 3) => {
    const words = this.textToWords(text)
    console.log(
      'sim is',
      this.wordsDistance(words, this.textToWords('food is great'))
    )
    const items = (this.items || []).map(item => {
      const title = item.title
      const text = item.body
      return {
        similarity:
          this.wordsDistance(words, this.textToWords(title)) +
          this.wordsDistance(words, this.textToWords(text)),
        item,
      }
    })
    return sortBy(items, 'similarity').slice(0, n)
  }
}
