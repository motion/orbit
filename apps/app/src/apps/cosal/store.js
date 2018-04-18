import { watch, react } from '@mcro/black/store'
import { processDocument, mCosSimilarities, loadVectors } from './cosal'
import kdTree from 'static-kdTree'

const toggleItem = (xs, x) => (includes(xs, x) ? without(xs, x) : [...xs, x])
const toSentences = s => s.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|')

export default class CosalStore {
  selected = []

  documents = []
  documentCosal = []

  query = ''
  hasLoadedCosal = false

  @react({ log: false, delay: 1000 })
  queryCosal = [
    () => this.query,
    async () =>
      this.query.trim().length > 0
        ? (await this.getVectors([this.query]))[0]
        : null,
  ]

  @watch({ log: false })
  tree = () =>
    this.hasLoadedCosal &&
    kdTree(this.documentCosal.map(({ vector }) => vector.toJS()))

  @react({ log: false })
  results = [
    () => this.queryCosal,
    async (query, { sleep }) => {
      if (!query || !this.hasLoadedCosal) {
        return this.documents.slice(0, 10)
      }

      const candidates = this.tree.knn(query.vector, 40)

      const similarities = await mCosSimilarities(
        query.vector.toJS(),
        candidates.map(index => this.documentCosal[index].vector.toJS()),
      )

      await sleep(1)

      const docs = similarities.map((similarity, index) => ({
        similarity,
        ...this.documents[candidates[index]],
      }))

      return reverse(sortBy(this.addExactMatch(docs), 'similarity'))
    },
  ]

  addExactMatch = docs => {
    const totalWeights = sum(this.queryCosal.words.map(({ weight }) => weight))
    const totalPossiblePoints = 0.2

    return docs.map(document => {
      const { content, similarity, index } = document

      let matchWeight = 0
      this.queryCosal.words.map(queryWord => {
        // quick check
        if (
          content.toLowerCase().indexOf(queryWord.word.toLowerCase()) === -1
        ) {
          return false
        }

        const match = find(
          this.documentCosal[index].words,
          ({ word }) => word.toLowerCase() === queryWord.word.toLowerCase(),
        )

        if (!match) {
          return false
        }

        // weigh the query word importance more
        const weight = queryWord.weight * 0.7 + match.weight * 0.3
        matchWeight += weight
      })

      const exactSimilarity = matchWeight / totalWeights * totalPossiblePoints
      return {
        ...document,
        cosalSimilarity: similarity,
        exactSimilarity,
        similarity: similarity + exactSimilarity,
      }
    })
  }

  getAllVectors = async () => {
    let index = 0
    let batchSize = 20
    let vectors = []
    while (index < this.documents.length) {
      const docs = this.documents.slice(index, index + batchSize)
      vectors = [
        ...vectors,
        ...(await this.getDocVectors(
          docs.map(({ index }) => index),
          index === 60,
        )),
      ]
      index += batchSize
    }
    return vectors
  }

  willMount = async () => {
    window.cosal = this

    const textsRaw = (await (await fetch('/dist/reviews.txt')).text())
      .split('\n')
      .filter(text => text.length > 0)

    const testDocs = []

    this.documents = [...testDocs, ...textsRaw] //shuffle(
      .map((content, index) => ({
        content: toSentences(content)
          .slice(0, 3)
          .join(' '),
        index,
        id: index,
      }))
      .slice(0, 200)

    await loadVectors()
    this.documentCosal = await this.getAllVectors()
    this.hasLoadedCosal = true
  }

  getDocVectors = async (indices, debug) => {
    const texts = indices.map(index =>
      this.documents[index].content.toLowerCase(),
    )
    const vecs = await this.getVectors(texts, debug)
    return vecs
  }

  getVectors = async (documents, debug) => {
    return await Promise.all(documents.map(doc => processDocument(doc, debug)))
  }

  toggle = index => {
    this.selected = toggleItem(this.selected, index)
  }
}
