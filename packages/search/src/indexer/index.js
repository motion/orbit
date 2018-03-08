import winkNlp from 'wink-nlp-utils'
import bm25f from './bm25f'
import { store, watch } from '@mcro/black/store'
import {
  includes,
  reverse,
  sortedUniqBy,
  max,
  sortBy,
  flatten,
  range,
  uniq,
} from 'lodash'
import debug from 'debug'
// import stopwords from './stopwords'
import {
  minKBy,
  wordMoversDistance,
  splitSentences,
  isAlphaNum,
  vectorsToCentroid,
  cosineSimilarity,
  cosineSimilarities,
} from '../helpers'

// TODO import from constants
const API_URL = 'http://localhost:3001'

const log = debug('indexer')
log.enabled = true

const sleep = ms => new Promise(res => setTimeout(res, ms))

@store
export default class Indexer {
  engine = null
  fragments = null
  embedding = null
  lastQuery = null
  centroids = null
  documents = []

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

  async willMount({ embedding, documents }) {
    this.embedding = embedding
    await this.setDocuments(documents)
    // this.centroids = this.fragments.map(this.fragmentToCentroid)
    window.indexer = this
  }

  getSentences = async paragraph => {
    const sentences = splitSentences(paragraph)
    console.log('sentences are', sentences)
    return await Promise.all(
      sentences.map(async text => {
        const vectors = await this.getVectors(text)
        return { text, vectors }
      }),
    )
  }

  toParagraphs = async ({ title, text }, index) => {
    return {
      title,
      index,
      paragraphs: await Promise.all(text.split('\n').map(this.getSentences)),
    }
  }

  setDocuments = async documents => {
    if (!documents) {
      return
    }

    this.documentsSource = documents

    this.documents = await Promise.all(documents.map(this.toParagraphs))
    console.log('fragments are', this.fragments)

    // this.engine = this.createEngine()
  }

  toWords = text => {
    if (!text) {
      return []
    }

    const valid = word => word.length > 0 && isAlphaNum(word)

    return text
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .split(' ')
      .filter(valid)
  }

  createEngine = () => {
    const engine = bm25f()

    engine.defineConfig({ fldWeights: { title: 3, body: 1 } })

    engine.definePrepTasks([
      winkNlp.string.lowerCase,
      winkNlp.string.removeExtraSpaces,
      winkNlp.string.tokenize0,
      // winkNlp.tokens.propagateNegations,
      winkNlp.tokens.removeWords,
      winkNlp.tokens.stem,
    ])

    this.fragments.forEach(({ title, body }, index) => {
      // index is used as ID
      engine.addDoc({ title, body }, index)
    })

    engine.consolidate()

    return engine
  }

  getVectors = async sentence => {
    const hash = `vectors-${sentence}`

    if (localStorage.getItem(hash)) {
      return JSON.parse(localStorage.getItem(hash))
    }
    console.log('src getting vectors for', sentence)

    const val = await (await fetch(
      `${API_URL}/sentence?sentence=${encodeURIComponent(sentence)}`,
    )).json()

    const { values } = val

    localStorage.setItem(hash, JSON.stringify(values))

    return values
  }

  search = async (query, count = 10) => {
    const vectors = await this.getVectors(query)

    const distances = flatten(
      this.paragraphs.map(({ document, sentences }) => {
        return sentences.map(sentence => {
          const sim = cosineSimilarities(vectors, sentence.vectors)
          return {
            document,
            sentence: sentence.text,
            distance: sim / Math.pow(sentence.vectors.length, 0.6),
          }
        })
      }),
    )

    const sentences = reverse(sortBy(distances, 'distance')).slice(0, count)
    console.log('sents are', sentences)

    const results = sentences.map(({ sentence, document, distance }) => {
      return {
        item: this.documentsSource[document],
        debug: [],
        toBold: [],
        matched: [],
        wmd: [],
        index: document,
        similarity: distance,
        snippet: sentence,
      }
    })

    return {
      results,
      autocomplete: [],
    }
  }
}
