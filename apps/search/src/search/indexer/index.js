import winkNlp from 'wink-nlp-utils'
import bm25f from './bm25f'
import { store, watch } from '@mcro/black/store'
import {
  includes,
  reverse,
  max,
  sortBy,
  range,
  last,
  uniq,
  flatten,
  capitalize,
} from 'lodash'
import debug from 'debug'
import stopwords from './stopwords'
import {
  minKBy,
  wordMoversDistance,
  splitSentences,
  isAlphaNum,
  vectorsToCentroid,
  cosineSimilarity,
} from '../helpers'
import namedEntityRecognition from './namedEntityRecognition'
import getFragments from './getFragments'

/*
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
*/

const allIndexesString = (string, finding) => {
  const indexes = []
  const lower = string.toLowerCase()
  let count = 0
  while (true) {
    const index = lower.indexOf(finding, last(indexes) ? last(indexes) + 1 : 0)

    if (index === -1 && count > 25) return indexes
    count += 1

    indexes.push(index)
  }
}

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

  @watch
  entities = () => this.fragments && namedEntityRecognition(this.fragments)

  constructor({ embedding, documents }) {
    this.embedding = embedding
    this.setDocuments(documents)
    this.centroids = this.fragments.map(this.fragmentToCentroid)
  }

  setDocuments = documents => {
    this.fragments = flatten(documents.map(doc => getFragments(doc.body))).map(
      (frag, index) => ({ ...frag, index })
    )

    this.engine = this.createEngine()
  }

  toWords = text => {
    if (!text) {
      return []
    }

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

    engine.defineConfig({ fldWeights: { title: 3, subtitle: 2, body: 1 } })

    engine.definePrepTasks([
      winkNlp.string.lowerCase,
      winkNlp.string.removeExtraSpaces,
      winkNlp.string.tokenize0,
      winkNlp.tokens.propagateNegations,
      winkNlp.tokens.removeWords,
      winkNlp.tokens.stem,
    ])

    this.fragments.forEach(({ title, subtitle, body }, index) => {
      // index is used as ID
      engine.addDoc({ title, subtitle, body }, index)
    })

    engine.consolidate()

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

  queryToCentroid = query => {
    const words = uniq(this.toWords(query))
      .filter(word => this.embedding.vectors[word])
      .map(word => ({
        vec: this.embedding.vectors[word],
        weight: 1,
      }))

    return vectorsToCentroid(words, this.embedding)
  }

  fragmentToCentroid = fragment => {
    const { title, subtitle, body } = fragment
    const combined = [title || '', subtitle || '', body].join(' ')

    const words = uniq(this.toWords(combined))
    const weights = words.map(word => this.wordWeight(fragment, word))
    const maxWeight = max(weights)

    const vecs = words.map(word => ({
      vec: this.embedding.vectors[word],
      weight: this.wordWeight(fragment, word) / maxWeight,
    }))

    return vectorsToCentroid(vecs, this.embedding)
  }

  nearestFragments = vec => {
    const distance = this.fragments.map((item, index) => {
      return {
        title: item.title,
        index,
        distance: cosineSimilarity(Math.random(), vec, this.centroids[index]),
      }
    })

    const vals = sortBy(distance, _ => -_.distance).slice(0, 400)

    return vals
  }

  nearestWords = fragment => {
    return this.embedding.nearestWordsByVec(this.centroids[fragment.index])
  }

  wordWeight = (fragment, word) => {
    const { prepareInput, documents, token2Index } = this.engine

    const docToken = prepareInput(word, 'search')
    const id = token2Index[docToken]
    if (!id) {
      return false
    }

    const val = documents[fragment.index].freq[id]
    return val
  }

  fullText = fragment =>
    [fragment.title, fragment.subtitle || '', fragment.body].join(' ')

  autocomplete = (queryWords, fragments) => {
    const cooccur = {}

    // co-occurance
    fragments.forEach((fragment, index) => {
      uniq(this.toWords(this.fullText(fragment))).forEach(word => {
        if (!cooccur[word]) {
          cooccur[word] = { weight: 0, indexes: new Set() }
        }

        cooccur[word].weight +=
          Math.sqrt(this.wordWeight(fragment, word)) *
          (1 - index / fragments.length)
        cooccur[word].indexes.add(fragment.index)
      })
    })

    if (false) {
      const next = {}
      queryWords.map(word => {
        fragments.map(fragment => {
          const text = this.fullText(fragment)

          const indexes = allIndexesString(text, word)
          indexes.forEach(index => {
            const nextWord = text.slice(index, index + 50).split(' ')[1]
            if (!nextWord) return
            if (capitalize(nextWord) === nextWord) {
              if (!next[nextWord]) {
                next[nextWord] = new Set()
              }
              next[nextWord].add(fragment.index)
            }
          })
        })
      })
      const mostNext = reverse(
        sortBy(
          Object.keys(next)
            .filter(
              word => !includes(queryWords, word) // && Array.from(next[word]).length > 2
            )
            .map(word => ({
              weight: Array.from(next[word]).length, // * tot(word),
              word,
            })),
          'weight'
        )
      ).filter(_ => !isNaN(_.weight))
      console.log('most next is', mostNext)
    }

    const mostCooccur = reverse(
      sortBy(
        Object.keys(cooccur)
          .filter(
            word =>
              !includes(queryWords, word) &&
              Array.from(cooccur[word].indexes).length > 2
          )
          .map(word => ({
            weight: cooccur[word].weight, // * totalWeight(word),
            word,
          })),
        'weight'
      )
    ).filter(_ => !isNaN(_.weight))

    return mostCooccur
  }

  search = async (query, count = 10, debug = true) => {
    const words = uniq(this.toWords(query))
    const queryCentroid = this.queryToCentroid(query)

    const fragments = this.nearestFragments(queryCentroid)

    /* last searched allows us to cancel mid-search requsest */
    this.lastQuery = query

    const results = fragments.map(() => 0)

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

    const titlesDistance = await runWmd(fragments.map(_ => _.title))
    const subtitlesDistance = await runWmd(fragments.map(_ => _.subtitle))
    const bodyDistance = await runWmd(fragments.map(_ => _.body))

    // we bailed somewhere and should abandon ship
    /*if (includes([titlesDistance, subtitlesDistance, bodyDistance], false)) {
      return false
    }*/

    const addDistance = ({ word, weight }, index) => {
      // word weight is how important that terms is to the document
      // weight is how close the word is to the query word
      const wordWeight = Math.pow(this.wordWeight(fragments[index], word), 0.8)

      if (weight === Infinity) return 0
      if (wordWeight === false) return 0

      const val =
        (1 - weight) * Math.pow(wordWeight, 0.5) + (results[index] || 0)
      // (wordWeight * Math.pow(1 - weight, 2) || 0) + (results[index] || 0)
      results[index] = val
      return val
    }

    // Math.pow(freq, Math.max(0, 1 - weight))
    // Iterate for every token in the preapred text.
    const debugInfos = []
    fragments.forEach((fragment, currentFragentIndex) => {
      const debugInfo = { nearest: [] }
      range(words.length).forEach(termIndex => {
        // nearest index is the current loop
        if (debug) {
          debugInfo.nearest.push(titlesDistance[currentFragentIndex][termIndex])
        }

        addDistance(
          bodyDistance[currentFragentIndex][termIndex],
          currentFragentIndex
        )
        addDistance(
          subtitlesDistance[currentFragentIndex][termIndex],
          currentFragentIndex
        )
        addDistance(
          titlesDistance[currentFragentIndex][termIndex],
          currentFragentIndex
        )
      })
      debugInfos.push(debugInfo)
    })

    const fragmentsByDistance = reverse(
      sortBy(
        results.map((val, index) => ({
          distance: val,
          fragment: fragments[index],
          debug: debugInfos[index],
        })),
        'distance'
      )
    ).slice(0, Math.max(count * 3, 1))

    const resultsByDistance = fragmentsByDistance
      .map(({ distance, fragment, debug }) => {
        return {
          item: this.fragments[fragment.index],
          debug,
          toBold: [],
          wmd: [],
          index: fragment.index,
          similarity: distance,
          snippet: this.getSnippet(query, this.fragments[fragment.index]),
        }
      })
      .filter(i => i.similarity !== Infinity)

    // only return one for each title
    const cachedTitles = []
    const noDuplicates = resultsByDistance.filter(result => {
      if (includes(cachedTitles, result.item.title)) {
        return false
      }
      cachedTitles.push(result.item.title)
      return true
    })

    const finalResults = noDuplicates.slice(0, count)
    return {
      results: finalResults,
      autocomplete: this.autocomplete(
        query.split(' '),
        resultsByDistance.map(_ => _.item)
      ).slice(0, 10),
    }
  }
}
