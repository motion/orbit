import { mean, uniq, sortBy, reverse, memoize } from 'lodash'

import { sentences, encodeEntity } from './utils'
import ner from './ner'
import { watch, store } from '@mcro/black'
import marginalDocs from './marginal.json'

console.log('marginal is', marginalDocs)

const countOf = (xs, x) => xs.filter(_x => _x === x).length
import { API_URL } from '~/constants'

const cleanDocText = text =>
  text
    // multiple spaces
    .replace(/\s\s+/g, ' ')
    .replace(/\â\€\™/g, "'")
    .replace(/\â\€\˜/g, "'")
    .replace(/\â\€\¦/g, '')
    .replace(/\â\€\œ/g, '"')
    .replace(/\â\€\�/g, '"')
    .replace(/\�/g, '')
    .replace(/\Â/g, '')
    .replace(/â€“/g, '"')
    .replace(/\â\€\¦/g, '')

@store
export default class LanguageStore {
  entities = null
  documents = []
  outerEntities = []
  outerDocuments = []
  activeWord = null
  boxMarginTop = 0
  articleIndex = -1
  knowledge = null
  knowledgeMore = false
  firstDoc = {
    title: 'Test Document',
    text: `
    there are many hidden codes in Plato but the most important is fire. The fire comes from the cave. Fire is warm is so is Puerto Rico. A not warm place is Toronto - would you agree? A great dataset for VR is MNIST.
    `,
  }

  @watch
  idfs = () => {
    const total = {}
    this.entities.forEach(words => {
      words.forEach(word => {
        word = word.toLowerCase()
        if (!total[word]) {
          total[word] = 0
        }
        total[word] += 1
      })
    })
    console.log('calculating idfs', total)

    return total
  }

  @watch
  tfs = () => {
    return this.entities.map(words => {
      words = words.map(w => w.toLowerCase())
      return words.reduce(
        (acc, word) => ({
          ...acc,
          [word.toLowerCase()]: countOf(words, word.toLowerCase()),
        }),
        {},
      )
    })
  }

  @watch
  tfidf = () =>
    this.tfs &&
    this.idfs &&
    this.entities.map((words, docIndex) => {
      words = words.map(w => w.toLowerCase())
      return words.reduce(
        (acc, word) => ({
          ...acc,
          [word.toLowerCase()]:
            this.tfs[docIndex][word.toLowerCase()] /
            this.idfs[word.toLowerCase()],
        }),
        {},
      )
    })

  @watch
  activeEntities = () => this.entities && this.entities[this.articleIndex]

  @watch
  article = () => {
    if (!this.documents) {
      return null
    }

    const val =
      this.articleIndex > -1
        ? cleanDocText(this.documents[this.articleIndex].text)
        : ''

    return val
  }

  ner = ner

  @watch
  docTextsWithEntities = () =>
    this.entities &&
    this.entities.map((docEntities, index) => {
      let { text } = this.documents[index]
      text = cleanDocText(text)

      docEntities.forEach(name => {
        try {
          text = text.replace(
            new RegExp('[^:-]' + name + '([^a-zA-Z-:])', 'i'),
            () => ` ` + encodeEntity(name) + ` `,
          )
        } catch (err) {}
      })
      return text
    })

  @watch
  docCombinedWithEntities = () =>
    this.docTextsWithEntities.map(
      (text, index) => `${this.documents[index].title} ${text}`,
    )

  @watch
  articleWithEntities = () =>
    this.articleIndex > -1 &&
    this.docTextsWithEntities &&
    this.docTextsWithEntities[this.articleIndex]

  getOuterDocuments = async users => {
    const url = `http://localhost:3001/fetcher?users=${users.join(',')}`
    const json = await (await fetch(url)).json()
    localStorage.setItem('outerDocuments', JSON.stringify(json))
    this.outerDocuments = json
    return json
  }

  async willMount() {
    window.rel = this
    let documents = marginalDocs.filter(({ title, text }) => title && text)
    this.outerDocuments = JSON.parse(
      localStorage.getItem('outerDocuments') || '[]',
    )
    if (this.firstDoc) {
      documents = [this.firstDoc, ...documents]
    }

    this.documents = documents.slice(0, 150).map((doc, index) => ({
      ...doc,
      index,
      title: cleanDocText(doc.title),
      text: cleanDocText(doc.text),
    }))

    this.outerEntities = this.outerDocuments.map(({ text }) => this.ner(text))
    this.entities = this.documents.map(({ title, text }) =>
      this.ner(title + ' ' + text),
    )
    this.articleIndex = 0
  }

  @watch allWords = () => this.titles && uniq(this.titles.join(' ').split(' '))

  @watch loading = () => !this.tfidf || this.tfidf.length === 0

  @watch titles = () => this.documents.map(doc => doc.title.toLowerCase())

  @watch avgDl = () => mean(this.titles.map(d => d.length))

  @watch
  queryResults = () => (this.activeWord ? this.query(this.activeWord) : [])

  @watch
  activeResults = () =>
    this.queryResults.filter(({ index }) => index !== this.articleIndex)

  snippet = (index, entity) => {
    const matches = sentences(this.documents[index].text).filter(
      text => text.indexOf(entity) > -1,
    )

    const truncate = s => s

    return matches.length > 0 ? truncate(matches[0]) : ''
  }

  getKnowledge = memoize(async word => {
    const json = await (await fetch(
      `${API_URL}/knowledge?entity=${word}`,
    )).json()

    return json
  })

  setActiveWord = async word => {
    this.activeWord = word
    this.knowledge = null
    this.knowledgeMore = false
    const json = await this.getKnowledge(word)
    this.knowledge = json[0]

    return true
  }

  activate = index => {
    this.activeWord = null
    this.knowledge = null
    this.articleIndex = index
  }

  query = memoize(q => {
    q = q.toLowerCase()
    const k = 1.2
    const b = 0.75

    const scores = this.docCombinedWithEntities
      .map((text, index) => {
        const idf = this.idfs[q]
        const termFreq = this.tfs[index][q]

        if (!termFreq) return null

        const top = termFreq * (k + 1)
        const bottom = termFreq + k * (1 - b + b * (text.length / this.avgDl))

        const score = idf * (top / bottom)

        return { index, type: 'result', doc: this.documents[index], score }
      })
      .filter(_ => _ !== null)
      .filter(score => score > 0)

    const outerScores = this.outerEntities
      .map((entities, index) => ({
        index,
        type: 'outerResult',
        doc: this.outerDocuments[index],
        score: entities.filter(name => name.toLowerCase() === q).length,
      }))
      .filter(_ => _ !== null)
      .filter(score => score > 0)
    const results = reverse(sortBy(scores, 'score')).slice(0, 5)
    const outerResults = reverse(sortBy(outerScores, 'score')).slice(0, 5)

    return [...outerResults, ...results]
  })
}
