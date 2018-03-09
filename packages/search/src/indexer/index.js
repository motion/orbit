import { store, watch } from '@mcro/black/store'
import { reverse, range, sortBy, flatten } from 'lodash'
import debug from 'debug'
import { splitSentences, cosineSimilarities } from '../helpers'

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
  totalDocuments = 0

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
    const paragraphTexts = text.split('\n')
    const paragraphs = await batchMapPromise(
      paragraphTexts,
      this.getSentences,
      2,
    )

    return {
      title,
      index,
      paragraphs,
    }
  }

  sentenceDistance = async (s, s2) => {
    const vectors = await this.getVectors(s)
    return (
      cosineSimilarities(vectors, await this.getVectors(s2)) / vectors.length
    )
  }

  setDocuments = async documentSources => {
    this.totalDocuments = documentSources.length
    this.indexing = true
    this.totalIndexed = 0
    await batchMapPromise(
      documentSources,
      this.toDocument,
      2,
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

    if (localStorage.getItem(hash)) {
      return JSON.parse(localStorage.getItem(hash))
    }

    const url = `${API_URL}/sentence?sentence=${encodeURIComponent(sentence)}`

    const { values } = await (await fetch(url)).json()

    try {
      localStorage.setItem(hash, JSON.stringify(values))
    } catch (err) {}

    return values
  }

  search = async (query, options = { count: 10, onePerDoc: true }) => {
    const vectors = await this.getVectors(query)

    const distances = flatten(
      this.paragraphs.map(({ document, sentences }) => {
        return sentences.map(sentence => {
          const sim = cosineSimilarities(vectors, sentence.vectors)
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
