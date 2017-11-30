import winkNlp from 'wink-nlp-utils'
import bm25f from './bm25f'
import { store, watch } from '@mcro/black'
import { range, uniq, sortedUniqBy, flatten } from 'lodash'
import debug from 'debug'
import {
  minKBy,
  wordMoversDistance,
  sumCounts,
  splitSentences,
} from '../helpers'
import namedEntityRecognition from './namedEntityRecognition'
import sliceItem from './sliceItem'

const isAlphaNum = s => /^[a-z0-9]+$/i.test(s)

const log = debug('indexer')
log.enabled = true

@store
export default class Indexer {
  engine = null
  items = null
  embedding = null
  index2Token = null

  @watch entities = () => this.items && namedEntityRecognition(this.items)

  @watch
  itemsText = () =>
    (this.items || []).map(item => `${item.title}\n${item.body}`)

  constructor({ items, embedding }) {
    this.items = flatten(items.map(this.slice))
    this.embedding = embedding

    this.react(
      () => this.items.length,
      async () => {
        debug('indexing with items: ', items.length)
        this.engine = this.createEngine()
        debug('indexed')
      },
      true
    )
  }

  slice = item => {
    return sliceItem(item.body)
  }

  documentsToImportantTerms = indexes => {
    const freqs = sumCounts(
      indexes.map(index => this.engine.documents[index].freq)
    )
    const tokenFreqs = Object.keys(freqs).reduce(
      (acc, termIndex) => [
        ...acc,
        { token: this.index2Token[termIndex], freq: freqs[termIndex] },
      ],
      []
    )

    const topTokenFreqs = minKBy(tokenFreqs, 15, _ => -_.freq)

    return topTokenFreqs
  }

  toWords = text => {
    const valid = word =>
      word.length > 0 && isAlphaNum(word) && this.embedding.vectors[word]

    return text
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .split(' ')
      .filter(valid)
  }

  createEngine = () => {
    const engine = bm25f()
    window._engine = engine
    engine.defineConfig({ fldWeights: { title: 3, subtitle: 2, body: 1 } })

    engine.definePrepTasks(
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
    engine.definePrepTasks([
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
      engine.addDoc(
        { title: doc.title, subtitle: doc.subtitle, body: doc.body },
        i
      )
    })

    engine.consolidate()
    this.index2Token = engine.getIndex2Token()

    return engine
  }

  getSnippet = (text, item) => {
    const sentences = splitSentences(item.body)
    const distances = sentences.map(sentence => {
      return {
        sentence,
        distance: wordMoversDistance(
          this.toWords(text),
          this.toWords(sentence),
          this.embedding.vectors
        ).total,
      }
    })

    const smallest = minKBy(distances, 1, _ => _.distance)[0]
    if (!smallest) return ''
    return `similarity: ${smallest.distance}. Sentence: ${smallest.sentence}`
  }

  search = (text, count = 10) => {
    console.log('text is', text, 'count is', count)
    const { helpers, prepareInput, documents, token2Index } = this.engine

    const results = Object.create(null)

    const words = uniq(this.toWords(text))
    const docBodyTerms = this.items.map(
      ({ body }) =>
        wordMoversDistance(
          words,
          uniq(this.toWords(body)),
          this.embedding.vectors
        ).list
    )

    const docSubtitleTerms = this.items.map(
      ({ subtitle }) =>
        wordMoversDistance(
          words,
          uniq(this.toWords(subtitle)),
          this.embedding.vectors
        ).list
    )

    const docTitleTerms = this.items.map(
      ({ title }) =>
        wordMoversDistance(
          words,
          uniq(this.toWords(title)),
          this.embedding.vectors
        ).list
    )

    const addRank = ({ word, weight }, docIndex) => {
      const docToken = prepareInput(word, 'search')
      const id = token2Index[docToken]
      // const freq = this.engine.getWeights(word)
      const freq = documents[docIndex].freq[id]

      if (id) {
        results[docIndex] =
          (freq * Math.pow(1 - weight, 2) || 0) + (results[docIndex] || 0)
      }
    }
    // Math.pow(freq, Math.max(0, 1 - weight))
    // Iterate for every token in the preapred text.
    range(words.length).forEach(termIndex => {
      this.items.forEach((_, docIndex) => {
        addRank(docBodyTerms[docIndex][termIndex], docIndex)
        addRank(docSubtitleTerms[docIndex][termIndex], docIndex)
        addRank(docTitleTerms[docIndex][termIndex], docIndex)
      })
    })

    const output = helpers.object
      .table(results)
      .sort(helpers.array.descendingOnValue)
      .slice(0, Math.max(count * 3, 1))

    const allOutput = output
      .map(vals => {
        const index = vals[0]
        const similarity = vals[1]

        return {
          item: this.items[index],
          toBold: docBodyTerms[index].map(_ => _.word),
          wmd: docBodyTerms[index],
          index,
          similarity,
          snippet: this.getSnippet(text, this.items[index]),
        }
      })
      .filter(i => i.similarity !== Infinity)

    // only return one for each title
    return sortedUniqBy(allOutput, _ => _.item.title).slice(0, count)
  }
}
