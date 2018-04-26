import { react, store } from '@mcro/black'
import { toCosal, mCosSimilarities } from './library'
import { reverse, sum, sortBy, uniqBy } from 'lodash'
import { Doc, Cosal, Covariance } from './types'
import commonWordsText from './commonWords'
import kdTree from 'static-kdTree'
import getInverseCovariance from './covariance'

const commonWords = commonWordsText.split('\n')

const sleep = ms => new Promise(res => setTimeout(res, ms))

// @ts-ignore
@store
export default class CosalStore {
  docs: Array<Doc> = []
  bitById = {}
  cosals = {}
  docsVersion = 1
  loading = true

  inverseCovariance?: Covariance = null
  localCovariance = []

  getSummary = cosal => {
    const wordsWithIndex = cosal.fields[0].words.map((word, index) => ({
      ...word,
      index,
    }))

    const words = reverse(sortBy(wordsWithIndex, 'weight')).slice(0, 6)

    return sortBy(uniqBy(words, 'string').slice(0, 3), 'index')
      .map(({ string }) => string)
      .join('::')
  }

  toCosal = doc => {
    return toCosal(doc, this.inverseCovariance)
  }

  addDocuments = async docs => {
    const newDocs = docs.filter(bit => !this.bitById[bit.id])

    if (newDocs.length === 0) {
      return false
    }

    console.log('new docs are', newDocs)

    newDocs.forEach(bit => {
      this.bitById[bit.id] = bit
    })

    console.log('getting covar for new docs', newDocs)
    const val = getInverseCovariance(newDocs)
    console.log('val is', val)
    this.inverseCovariance = val

    const cosals = (await Promise.all(newDocs.map(this.toCosal))).filter(
      i => i !== null,
    )

    cosals.forEach((cosal: any) => {
      this.cosals[cosal.id] = cosal
    })

    this.docsVersion += 1

    await sleep(500)

    return true
  }

  async willMount() {
    // warm start
  }

  async warm() {
    await Promise.all(
      commonWords.slice(0, 1000).map(async word => {
        return await this.toCosal({
          id: '' + Math.random(),
          fields: [{ weight: 1, content: word }],
          createdAt: Math.random(),
        })
      }),
    )
    return true
  }

  // @ts-ignore
  @react updateCosals = [() => this.docsVersion, async () => {}]

  // keep last tree so we can dispose of it
  tree = null

  // @ts-ignore
  @react({ log: false })
  getNearest = [
    () => {
      return this.docsVersion
    },
    () => {
      if (this.tree) {
        this.tree.dispose()
      }

      const ids = Object.keys(this.cosals)
      const values = ids.map(id => Array.from(this.cosals[id].vector))
      if (values.length === 0) {
        return () => []
      }

      const tree = kdTree(values)
      this.tree = tree
      return (vec, knn) =>
        tree.knn(Array.from(vec), knn).map(index => ids[index])
    },
  ]

  searchQuery = (query: string): any => {
    if (this.loading) {
      return []
    }

    return this.search({
      id: '' + Math.random(),
      fields: [{ weight: 1, content: query }],
      createdAt: +Date.now(),
    })
  }

  search = async (
    doc: Doc,
  ): Promise<Array<{ similarity: number; cosal: Cosal; id: number }>> => {
    if (!doc) {
      return null
    }
    const { vector } = await this.toCosal(doc)

    // @ts-ignore
    const candidates = this.getNearest(vector, 100)

    const similarities = await mCosSimilarities(
      vector,
      candidates.map(id => this.cosals[id].vector),
    )

    const docs = similarities.map((similarity, index) => ({
      similarity,
      cosal: this.cosals[candidates[index]],
      id: candidates[index],
    }))

    return reverse(sortBy(docs, 'similarity')) //reverse(sortBy(this.addExactMatch(docs), 'similarity'))
  }

  getExactMatch = (query: Cosal, doc: Cosal): number =>
    sum(
      query.fields[0].words.map(({ word }) => {
        doc.fields
          .filter(({ content }) => content.indexOf(word) > -1)
          .map(({ weight, words }) =>
            words
              .filter(item => item.word === word)
              .map(item => item.weight * weight),
          )
      }),
    )

  /*
  salientDocs = async (
    docCosals: Array<Cosal>,
  ): Promise<Array<{ weight: number; doc: Doc }>> =>
    saliency(docCosals, this.docCosals)
  */
}
