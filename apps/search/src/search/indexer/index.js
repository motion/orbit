import winkNlp from 'wink-nlp-utils'
import bm25f from './bm25f'
import { store, watch } from '@mcro/black/store'
import {
  includes,
  max,
  sortBy,
  range,
  uniq,
  sortedUniqBy,
  flatten,
} from 'lodash'
import debug from 'debug'
import stopwords from './stopwords'
import {
  minKBy,
  wordMoversDistance,
  sumCounts,
  splitSentences,
  cosineSimilarity,
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
  lastSearched = null
  centroids = null

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
      word.length > 0 &&
      isAlphaNum(word) &&
      !includes(stopwords, word) &&
      this.embedding.vectors[word]

    return text
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, '')
      .split(' ')
      .filter(valid)
  }

  createEngine = () => {
    const engine = bm25f()
    // window._engine = engine
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

    setTimeout(() => {
      this.centroids = this.items.map((item, index) => this.getCentroid(index))
      console.log(
        'nearest are',
        this.nearest(this.embedding.vectors['education'])
      )
    }, 800)

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

  getCentroidByWords = query => {
    const words = uniq(this.toWords(query))
    const zeros = this.embedding.vectors['test'].map(_ => 0)
    const addVec = (v, v2) => {
      const val = v.map((val, index) => val + (v2[index] - val))
      return val
    }

    return words.reduce((vec, word) => {
      return addVec(vec, this.embedding.vectors[word])
    }, zeros)
  }

  getCentroid = index => {
    const item = this.items[index]
    const combined = [item.title || '', item.subtitle || '', item.body].join(
      ' '
    )

    if (index === 1737) {
      console.log('combined is', combined)
    }

    const words = uniq(this.toWords(combined))
    const zeros = this.embedding.vectors['test'].map(_ => 0)
    const addVec = (v, v2, weight) => {
      const val = v.map((val, index) => val + (v2[index] - val) * weight)
      return val
    }
    const weights = words.map(word => this.wordWeight(index, word))
    const maxWeight = max(weights)

    return words.reduce((vec, word) => {
      if (index === 1737) {
        console.log('word is ', word, 'weight is', this.wordWeight(index, word))
      }
      return addVec(
        vec,
        this.embedding.vectors[word],
        this.wordWeight(index, word) / maxWeight
      )
    }, zeros)
  }

  nearest = vec => {
    const distance = this.items.map((item, index2) => {
      return {
        title: item.title,
        index: index2,
        distance: cosineSimilarity(Math.random(), vec, this.centroids[index2]),
      }
    })
    const start = +Date.now()
    // const vals = minKBy(distance, 150, _ => -_.distance)
    const vals = sortBy(distance, _ => -_.distance).slice(0, 150)

    return vals
  }

  nearestWords = index => {
    return this.embedding.nearestWordsByVec(this.centroids[index])
  }

  wordWeight = (docIndex, word) => {
    const { prepareInput, documents, token2Index } = this.engine

    const docToken = prepareInput(word, 'search')
    const id = token2Index[docToken]
    if (!id) {
      return false
    }
    const val = documents[docIndex].freq[id]
    return val
  }

  search = async (query, count = 10) => {
    const { helpers } = this.engine
    const sleep = ms => new Promise(res => setTimeout(res, ms))
    const queryCentroid = this.getCentroidByWords(query)
    /*
    const items = this.nearest(queryCentroid).map(_ => ({
      ...this.items[_.index],
      index: _.index,
    }))
    */
    const items = this.nearest(queryCentroid).map(_ => ({
      ...this.items[_.index],
      index: _.index,
    }))

    // const items = this.items
    /* last searched allows us to cancel mid-search requsest */
    this.lastQuery = query

    const results = Object.create(null)

    const words = uniq(this.toWords(query))

    const runWmd = async texts => {
      const total = []
      let i = 0
      for (const text of texts) {
        i++
        if (this.lastQuery !== query) {
          // there has been a new search and we should bail
          return false
        }

        total.push(
          wordMoversDistance(
            words,
            uniq(this.toWords(text)),
            this.embedding.vectors
          ).list
        )

        if (i % 300 === 0) {
          // sleep to check if query is still the same
          await sleep(1)
        }
      }

      return total
    }

    const docTitleTerms = await runWmd(items.map(({ title }) => title))
    const docSubtitleTerms = await runWmd(items.map(({ subtitle }) => subtitle))
    const docBodyTerms = await runWmd(items.map(({ body }) => body))

    // we bailed somewhere
    if (includes([docTitleTerms, docSubtitleTerms, docBodyTerms], false)) {
      return false
    }

    const addRank = ({ word, weight }, docIndex) => {
      const wordWeight = this.wordWeight(docIndex, word)

      if (wordWeight !== false) {
        results[docIndex] =
          (wordWeight * Math.pow(1 - weight, 2) || 0) + (results[docIndex] || 0)
      }
    }
    // Math.pow(freq, Math.max(0, 1 - weight))
    // Iterate for every token in the preapred text.
    range(words.length).forEach(termIndex => {
      items.forEach((item, curIndex) => {
        const docIndex = item.index
        addRank(docBodyTerms[curIndex][termIndex], docIndex)
        addRank(docSubtitleTerms[curIndex][termIndex], docIndex)
        addRank(docTitleTerms[curIndex][termIndex], docIndex)
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
          toBold: [],
          wmd: [],
          index,
          similarity,
          snippet: this.getSnippet(query, this.items[index]),
        }
      })
      .filter(i => i.similarity !== Infinity)

    // only return one for each title
    return sortedUniqBy(allOutput, _ => _.item.title).slice(0, count)
  }
}
