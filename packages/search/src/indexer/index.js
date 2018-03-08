import { store, watch } from '@mcro/black/store'
import { reverse, sortBy, flatten } from 'lodash'
import debug from 'debug'
import { splitSentences, cosineSimilarities } from '../helpers'

// TODO import from constants
const API_URL = 'http://localhost:3001'

const log = debug('indexer')
log.enabled = true

@store
export default class Indexer {
  paragraphs = []
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

  async willMount({ documents }) {
    window.indexer = this
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
    return {
      title,
      index,
      paragraphs: await Promise.all(
        text
          .split('\n')
          .slice(0, 2)
          .map(this.getSentences),
      ),
    }
  }

  setDocuments = async documentSources => {
    this.documentSources = documentSources.slice(0, 3)
    this.documents = await Promise.all(
      this.documentSources.map(this.toDocument),
    )

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

    return sentences
  }
}
