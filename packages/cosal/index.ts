import { react, store } from '@mcro/black'
import { toCosal, mCosSimilarities, getCovariance } from './library'
import { reverse, sum, sortBy } from 'lodash'
import { Doc } from './types'
import commonWordsText from './commonWords'
import kdTree from 'static-kdTree'

const commonWords = commonWordsText.split('\n')

const sleep = ms => new Promise(res => setTimeout(res, ms))

// @ts-ignore
@store
export default class CosalStore {
  docs: Array<Doc> = []
  bitById = {}
  cosals = {}
  docsVersion = 1
  localCovariance = []

  addDocuments = async docs => {
    const newDocs = docs.filter(bit => !this.bitById[bit.id])

    newDocs.forEach(bit => {
      this.bitById[bit.id] = bit
    })

    // getCovariance(docs)

    const cosals = await Promise.all(newDocs.map(toCosal))

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
        return await toCosal({
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
      const tree = kdTree(values)
      this.tree = tree
      return (vec, knn) =>
        tree.knn(Array.from(vec), knn).map(index => ids[index])
    },
  ]

  toCosal = toCosal

  searchQuery = (query: string): any => {
    return this.search({
      id: '' + Math.random(),
      fields: [{ weight: 1, content: query }],
      createdAt: +Date.now(),
    })
  }

  search = async (doc: Doc): Promise<Array<{ weight: number; doc: Doc }>> => {
    const { vector } = await toCosal(doc)

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
          .map(
            ({ weight, words }) =>
              words
                .filter(item => item.word === word)
                .map(({ weight }) => weight) * weight,
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
