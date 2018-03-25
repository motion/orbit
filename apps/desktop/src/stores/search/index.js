import { store, watch, react } from '@mcro/black/store'
import { sum, range, sortBy, flatten } from 'lodash'
import DB from './db'
import { splitSentences, wordMoversDistance, cosineSimilarity } from './helpers'
import summarize from './summarize'
import createKDTree from 'static-kdtree'
import getVectors from '~/embedding'
import { Desktop, App } from '@mcro/all'
import start from './start'

const stripPunctuation = s => s.replace(/[:".,/#!$%^&*;:{}=\-_`~()]/g, '')

const sentenceToWords = sentence =>
  sentence.split(' ').filter(i => i.trim().length > 0)
const wordsToSentence = words => words.join(' ')

// const wordVectors = readData('vectors.json')
// for some reason lodash's was acting strangely so I rewrote it
const sortedUniqBy = (xs, fn) => {
  const seen = {}
  return xs.filter(x => {
    const val = fn(x)
    if (seen[val]) {
      return false
    }
    seen[val] = true
    return true
  })
}

const sleep = ms => new Promise(res => setTimeout(res, ms))

const vecMean = xs => {
  if (xs.length === 0) {
    return []
  }

  return range(xs[0].length).map(
    dim => sum(xs.map(vec => vec[dim])) / xs.length,
  )
}

const batchMapPromise = async (xs, fn, batchSize, callback = () => {}) => {
  let hasStopped = false
  const onStop = () => {
    hasStopped = true
  }

  const batches = Math.ceil(xs.length / batchSize)
  let items = []
  for (const batch of range(batches)) {
    await sleep(150)
    if (hasStopped) {
      break
    }

    const start = batch * batchSize
    const end = (batch + 1) * batchSize
    const batchXs = await Promise.all(xs.slice(start, end).map(fn))

    items = [...items, ...batchXs]

    callback({ start, end, onStop, items })
  }

  return items
}

@store
export default class Search {
  getVectors = getVectors
  stripPunctuation = stripPunctuation

  paragraphs = []
  documents = []
  indexing = false
  totalIndexed = 0
  totalIndexedSentences = 0
  currentTotalSentences = 0
  totalDocuments = 0

  @watch({ log: false })
  indexStatus = () =>
    `index: doc ${this.totalIndexed}/${this.totalDocuments} line ${
      this.totalIndexedSentences
    }/${this.currentTotalSentences} `

  @watch({ log: false })
  paragraphs = () =>
    flatten(
      this.documents.map(({ paragraphs }, index) =>
        paragraphs.map(sentences => ({
          document: index,
          sentences,
        })),
      ),
    )

  @watch({ log: false })
  space = () => {
    const vectors = []
    const metaData = []

    this.paragraphs.forEach((para, paragraphIndex) => {
      para.sentences.forEach((sentence, sentenceIndex) => {
        vectors.push(sentence.sentenceVector)
        metaData.push({ paragraphIndex, sentenceIndex })
      })
    })

    return {
      tree: new createKDTree(vectors),
      metaData,
    }
  }

  @react({ log: false })
  setIndexStatus = [
    () => this.indexStatus,
    indexStatus => Desktop.setSearchState({ indexStatus }),
  ]

  @react({ log: false })
  runSearch = [
    () => App.state.query,
    async () => {
      const { query } = App.state
      const start = +Date.now()
      const results = await this.search(query)
      // make sure we haven't had a new query yet
      if (App.state.query === query) {
        Desktop.setSearchState({
          searchResults: results || [],
          performance: +Date.now() - start,
        })
      }
    },
  ]

  async willMount() {
    this.db = new DB()
    await this.db.mount()
    const dataset = await start()
    this.setDocuments(dataset)
  }

  getSentences = async paragraph => {
    const sentences = splitSentences(paragraph)

    return await Promise.all(
      sentences.map(async text => {
        const words = sentenceToWords(text)
        const { vectors, sentenceVector } = await this.getWordVectors(words)

        return { text, words, vectors, sentenceVector }
      }),
    )
  }

  toDocument = async ({ title, text }, index) => {
    this.totalIndexedSentences = 0
    const paragraphTexts = text.split('\n')
    this.currentTotalSentences = paragraphTexts.length
    const paragraphs = await batchMapPromise(
      paragraphTexts,
      this.getSentences,
      2,
      ({ end }) => {
        this.totalIndexedSentences = end
      },
    )

    return {
      title,
      index,
      paragraphs,
    }
  }

  sentenceDistance = async (s, s2) => {
    const vectors = await this.getSentenceVector(s)
    return (
      cosineSimilarity(vectors, await this.getSentenceVector(s2)) /
      vectors.length
    )
  }

  sentenceWMD = async (s, s2) => {
    const w = sentenceToWords(s)
    const w2 = sentenceToWords(s2)

    const first = await this.getWordVectors(w)
    const second = await this.getWordVectors(w2)
    console.log('first is', first, 'second is', second)

    const wmd = wordMoversDistance(first, second)
    return wmd
  }

  setDocuments = async documentSources => {
    // lets keep the articles short for testing
    documentSources = documentSources
      .filter(({ text }) => text.length < 5000)
      .map(obj => {
        return {
          ...obj,
          text: summarize(obj.text),
        }
      })

    this.totalDocuments = documentSources.length
    this.indexing = true
    this.totalIndexed = 0
    await batchMapPromise(
      documentSources,
      this.toDocument,
      1,
      ({ end, items }) => {
        this.totalIndexed = end
        this.documentSources = documentSources.slice(0, end)
        this.documents = items
      },
    )

    this.indexing = false

    return true
  }

  getWordVectors = async words => {
    const sentence = wordsToSentence(words)
    const hash = `word-vectors-${sentence}`
    const sentenceHash = `vectors-${sentence}`

    const cachedVectors = await this.db.getItem(hash)
    if (cachedVectors) {
      const cachedSentenceVector = await this.db.getItem(sentenceHash)
      return {
        words,
        vectors: cachedVectors,
        sentenceVector: cachedSentenceVector,
      }
    }

    const vectors = await getVectors(words.map(stripPunctuation))
    const sentenceVector = vecMean(vectors)

    try {
      const str = JSON.stringify(vectors)
      const sentenceStr = JSON.stringify(sentenceVector)
      this.db.setItem(hash, str)
      this.db.setItem(sentenceHash, sentenceStr)
    } catch (err) {
      console.log('err is', err)
    }

    return { words, vectors, sentenceVector }
  }

  getSimpleSentenceVectors = async words => {
    const sentence = wordsToSentence(words)
    const getWord = word => {
      return wordVectors[word]
    }

    const allVectors = sentence.split(' ').map(getWord)
    const vectors = allVectors.filter(_ => _)

    // take out empty ones
    const val = { words, sentenceVector: vecMean(vectors), vectors }
    return val
  }

  getSentenceVector = async words => {
    const sentence = wordsToSentence(words)
    const hash = `vectors-${sentence}`

    const cachedValue = await this.db.getItem(hash)
    if (cachedValue) {
      return cachedValue
    }

    const vector = vecMean(await getVectors(sentence)).map(i => +i.toFixed(4))

    try {
      const str = JSON.stringify(vector)
      this.db.setItem(hash, str)
    } catch (err) {
      console.log('err is', err)
    }

    return vector
  }

  search = async (query, options = { count: 10, onePerDoc: true }) => {
    const words = sentenceToWords(query)

    if (!query) {
      return false
    }

    this.lastQuery = query

    const { vectors, sentenceVector } = await this.getWordVectors(words)

    // bail if we're out of date
    if (query !== this.lastQuery) {
      return false
    }

    const nearestNeighbors = this.space.tree
      .knn(sentenceVector, options.count * 3)
      .map(index => this.space.metaData[index])

    // bail if we're out of date
    if (query !== this.lastQuery) {
      return false
    }

    const sentences = sortBy(
      nearestNeighbors.map(({ sentenceIndex, paragraphIndex }, index) => {
        const paragraph = this.paragraphs[paragraphIndex]
        const sentence = paragraph.sentences[sentenceIndex]
        const documentIndex = paragraph.document
        // incorporate sentence distance into weighting
        const penalizeNearest = index / nearestNeighbors.length

        const wmd = wordMoversDistance(
          { words, vectors },
          { words: sentence.words, vectors: sentence.vectors },
        )

        const distance = wmd.total / vectors.length + 0.2 * penalizeNearest

        const document = this.documentSources[documentIndex]

        const context = paragraph.sentences.map(({ text }) => ({
          active: text === sentence.text,
          text,
        }))

        return {
          document,
          documentIndex,
          distance,
          wmd,
          sentence: sentence.text,
          context,
          title: document.title,
          subtitle: `distance: ${('' + distance).slice(0, 7)}`,
          content: sentence.text,
        }
      }),
      'distance',
    )

    const results = sortedUniqBy(sentences, _ => _.documentIndex).slice(
      0,
      options.count,
    )

    return results
  }
}
