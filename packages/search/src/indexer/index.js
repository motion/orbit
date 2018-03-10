import { store, watch } from '@mcro/black/store'
import { reverse, sum, range, sortBy, flatten } from 'lodash'
import debug from 'debug'
import DB from './db'
import { splitSentences, cosineSimilarity } from '../helpers'

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

const vecMean = xs =>
  range(xs[0].length).map(dim => sum(xs.map(vec => vec[dim])) / xs.length)

// TODO import from constants
const API_URL = 'http://localhost:3001'

const log = debug('indexer')
log.enabled = true

const batchMapPromise = async (xs, fn, batchSize, callback = () => {}) => {
  let hasStopped = false
  const onStop = () => {
    hasStopped = true
  }

  const batches = Math.floor(xs.length / batchSize)
  let items = []
  for (const batch of range(batches)) {
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
export default class Indexer {
  paragraphs = []
  documents = []
  indexing = false
  totalIndexed = 0
  totalIndexedSentences = 0
  currentTotalSentences = 0
  totalDocuments = 0
  @watch
  indexedStatus = () =>
    `documents: ${this.totalIndexed} / ${
      this.totalDocuments
    }. Indexing sentence: ${this.totalIndexedSentences} / ${
      this.currentTotalSentences
    } `

  @watch indexedPercentage = () => this.totalIndexed / this.totalDocuments * 100

  @watch
  paragraphs = () =>
    flatten(
      this.documents.map(({ paragraphs }, index) =>
        paragraphs.map(sentences => ({
          document: index,
          sentences,
        })),
      ),
    )

  async willMount({ documents }) {
    window.indexer = this
    window.pg = documents
    this.db = new DB()
    await sleep(300)
    await this.setDocuments(documents)
  }

  getSentences = async paragraph => {
    const sentences = splitSentences(paragraph)

    return await Promise.all(
      sentences.map(async text => {
        const vectors = await this.getVectors(text)
        return { text, vectors }
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
    const vectors = await this.getVectors(s)
    return cosineSimilarity(vectors, await this.getVectors(s2)) / vectors.length
  }

  setDocuments = async documentSources => {
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

  getVectors = async sentence => {
    const hash = `vectors-${sentence}`

    const cachedValue = await this.db.getItem(hash)
    if (cachedValue) {
      return JSON.parse(cachedValue)
    }

    const url = `${API_URL}/sentence?sentence=${encodeURIComponent(sentence)}`

    const { values } = await (await fetch(url)).json()
    const vector = vecMean(values).map(i => i.toFixed(4))

    try {
      const str = JSON.stringify(vector)
      this.db.setItem(hash, str)
    } catch (err) {
      console.log('err is', err)
    }

    return vector
  }

  search = async (query, options = { count: 10, onePerDoc: true }) => {
    const vectors = await this.getVectors(query)

    const distances = flatten(
      this.paragraphs.map(({ document, sentences }) => {
        return sentences.map(sentence => {
          const sim = cosineSimilarity(vectors, sentence.vectors)
          return {
            document: this.documentSources[document],
            documentIndex: document,
            sentence: sentence.text,
            distance: sim / sentence.vectors.length,
          }
        })
      }),
    )

    // if we're pruning, grab more so we can prune `count` later
    const initialCount = options.onePerDoc ? options.count * 3 : options.count

    const sentences = reverse(sortBy(distances, 'distance')).slice(
      0,
      initialCount,
    )

    if (!options.onePerDoc) {
      return sentences
    }
    window.sortedUnique = sortedUniqBy
    window.s

    return sortedUniqBy(sentences, _ => _.documentIndex).slice(0, options.count)
  }
}
