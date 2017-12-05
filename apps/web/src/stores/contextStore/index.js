import { store, watch } from '@mcro/black'
import { includes, last, uniqBy, memoize } from 'lodash'
import bm25 from './bm25'
import winkNlp from 'wink-nlp-utils'
import { cosineSimilarity, splitSentences, minKBy, emd } from './helpers'

let vectorCache = null

@store
export default class ContextStore {
  static toResult = context => ({
    id: context.url,
    title: context.selection || context.title,
    type: 'context',
    icon: context.application === 'Google Chrome' ? 'social-google' : null,
    image: context.favicon,
  })

  query = null
  _items = null
  @watch queryItems = () => this.query && this.query()
  @watch vectors = () => this.loadVectors()
  autocomplete = []
  sentences = []
  vectors = null
  engine = null
  qe = ''

  constructor({ query, items } = {}) {
    this._items = items
    this.query = query
    this.watch(this.watchIndex)
  }

  get items() {
    if (this.queryItems) {
      return this.queryItems
    }
    return this._items
  }

  setItems = val => {
    this._items = val
  }

  @watch
  docTexts = () => {
    return (this.items || [])
      .map(item => (item.title + '\n' + item.body).toLowerCase())
      .join('\n')
  }
  indexToToken = null
  searchResults = []

  get loading() {
    return this.engine === null
  }

  loadVectors = async () => {
    if (vectorCache) return vectorCache
    const text = await fetch(`/vectors50k.txt`).then(res => res.text())
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

  watchIndex = () => {
    if (!this.vectors) return
    if (!this.items || !this.items.length) return
    this.engine = bm25()

    // Step I: Define config
    // Only field weights are required in this example.
    this.engine.defineConfig({ fldWeights: { title: 3, body: 1 } })

    // Step II: Define PrepTasks
    // Set up preparatory tasks for 'body' field
    this.engine.definePrepTasks(
      [
        winkNlp.string.lowerCase,
        winkNlp.string.removeExtraSpaces,
        winkNlp.string.tokenize0,
        winkNlp.tokens.propagateNegations,
        winkNlp.tokens.removeWords,
        winkNlp.tokens.stem,
        winkNlp.tokens.stem,
      ],
      'body'
    )
    // Set up 'default' preparatory tasks i.e. for everything else
    this.engine.definePrepTasks([
      winkNlp.string.lowerCase,
      winkNlp.string.removeExtraSpaces,
      winkNlp.string.tokenize0,
      winkNlp.tokens.propagateNegations,
      winkNlp.tokens.stem,
      winkNlp.tokens.removeWords,
    ])

    // Step III: Add Docs
    // Add documents now...
    this.items.forEach((doc, i) => {
      // Note, 'i' becomes the unique id for 'doc'
      this.engine.addDoc({ title: doc.title, body: doc.body }, i)
    })

    console.time('running index')
    this.engine.consolidate()
    this.indexToToken = this.engine.getIndex2Token()
    console.timeEnd('running index')
  }

  docToWords = doc => {
    const freqs = this.engine.getWeights(doc.title).map(({ t, weight }) => ({
      weight: weight * 4,
      word: this.getRealWordFromText(t, doc.title),
    }))
    const freqs2 = this.engine.getWeights(doc.body).map(({ t, weight }) => ({
      weight,
      word: this.getRealWordFromText(t, doc.body),
    }))
    const allFreqs = [...freqs, ...freqs2].filter(_ => this.vectors[_.word])
    const freqsKey = {}
    allFreqs.forEach(({ weight, word }) => {
      freqsKey[word] = (freqsKey[word] || 0) + weight
    })
    const freqsTotalWeights = Object.keys(freqsKey).map(word => ({
      word,
      weight: freqsKey[word],
    }))
    const xs = minKBy(freqsTotalWeights, 15, _ => -_.weight)
    const norm = xs.map(x => ({ ...x, weight: x.weight / xs[0].weight }))
    const vec = norm.filter(i => this.vectors[i.word]).reduce((vec, item) => {
      const newVec = this.vectors[item.word]
      if (vec === null) return newVec

      return vec.map((_, i) => vec[i] + (newVec[i] - vec[i]) * item.weight)
    }, null)
  }

  nearestWords = vec => {
    const vecs = Object.keys(this.vectors).map(word => ({
      word,
      vec: this.vectors[word],
      distance: cosineSimilarity(Math.random(), vec, this.vectors[word]),
    }))
    return minKBy(vecs, 7, _ => -_.distance)
  }

  sentenceDistances = (terms, content) => {
    const toValidWords = doc =>
      doc
        .toLowerCase()
        .split(' ')
        .filter(w => this.vectors[w] || null)

    const termsWeights = toValidWords(terms).map(t => {
      const weights = this.engine.getWeights(t)
      return weights.length > 0 ? weights[0].weight : 0
    })
    const termsWords = toValidWords(terms)

    const toBold = minKBy(this.engine.getWeights(terms), 4, _ => -_.weight).map(
      ({ t }) => this.getRealWordFromText(t, terms)
    )

    return minKBy(
      splitSentences(content).map(sentence => ({
        sentence,
        toBold,
        distance: emd(
          termsWords,
          toValidWords(sentence),
          termsWeights,
          this.vectors
        ),
      })),
      2,
      _ => _.distance
    )
  }

  getSentences = text => {
    const txt = `getting sentence for text: ${text}`
    console.time(txt)
    this.sentences = this.searchResults.map(({ item }) => {
      const responses = this.sentenceDistances(text, item.body)
      return responses.length > 0 ? responses[0] : null
    })
    console.timeEnd(txt)
    return this.sentences
  }

  getRealWord = memoize(word => this.getRealWordFromText(word, this.docTexts))

  getRealWordFromText = (word, text) => {
    const index = text.toLowerCase().indexOf(word.toLowerCase())
    const slice = text.slice(index, index + 25)
    const val = slice.split(/[^A-Za-z0-9]/)[0]
    return val.length > 0 ? val : word
  }

  search = (text, n = 5) => {
    if (!text) {
      return []
    }
    if (!this.engine.isConsolidated()) {
      return []
    }
    /*
    const words = text
      .split(' ')
      .map(word => {
        if (this.engine.getWeights(word).length === 0) {
          return this.queryExpansion([word], 3)
        }
        return word
      })
      .join(' ')
    */

    const words = text
    const wordList = text.split(' ')

    let results = this.engine.search(words, n)
    /*
    this.qe = ''
    if (results.length < 4) {
      const qe = this.queryExpansion(text.split(' '), 10)
      this.qe = qe
      results = [...results, ...this.engine.search(qe, n)]
    }
    */

    // make sure query expansion doesn't return duplicates
    const vals = uniqBy(results, val => val[0])
      .slice(0, n)
      .map(res => {
        return {
          similarity: res[1],
          item: this.items[res[0]],
          index: res[0],
          debug: [],
        }
      })

    const freqs = {}

    vals.forEach(doc => {
      const { freq } = this.engine.documents[doc.index]
      Object.keys(freq).forEach(name => {
        const word = this.indexToToken[name]
        const val = freq[name]
        if (!freqs[word]) freqs[word] = 0
        freqs[word] += val
      })
    })

    const lastWord = last(wordList)
    const typingWord =
      lastWord.length > 0 && this.engine.getWeights(lastWord).length === 0

    const xs = minKBy(
      Object.keys(freqs).map(word => ({ word, val: freqs[word] })),
      15,
      _ => -_.val
    )

    let autocomplete = null
    if (typingWord) {
      autocomplete = xs
        .filter(i => i.word.indexOf(lastWord) === 0)
        .slice(0, 15)
        .map(item => ({ realWord: this.getRealWord(item.word), ...item }))
    } else {
      autocomplete = xs
        .slice(0, 15)
        .map(item => ({ realWord: this.getRealWord(item.word), ...item }))
        .filter(i => !includes(wordList, i.realWord))
    }

    this.autocomplete = autocomplete
    this.searchResults = vals
    this.sentences = []
    this.getSentences(text)

    return vals
  }
}
