import { react, store } from '@mcro/black'
import { App } from '@mcro/all'
import { toCosal, mCosSimilarities, mCosSimilarity } from './library'
import { reverse, sortBy } from 'lodash'
import { Doc, Cosal } from './types'
import kdTree from 'static-kdTree'

@store
export default class CosalStore {
  docs: Array<Doc> = []

  bitById = {}

  cosals = {}
  lastIndex = 0

  queryCosal = [() => App.state.query, () => `query is ${App.state.query}`]

  async willMount() {
    const rawBits = (await Bit.find({
      take: 800,
      where: { type: 'mail' },
      order: { updatedAt: 'DESC' },
    }))
      .filter(({ body, type }) => body.length > 0 && type === 'mail')
      .slice(0, 500)

    console.log('raw bits are', rawBits)

    rawBits.forEach(bit => {
      this.bitById[bit.id] = bit
    })

    this.docs = rawBits.map(({ id, title, body, createdAt }, index) => ({
      id,
      fields: [{ weight: 1, content: title }],
      createdAt,
    }))
  }

  @react
  updateCosals = [
    () => this.docs,
    async () => {
      console.log('starting cosal')
      const s = `running update for ${this.docs.length} docs`
      console.time(s)
      const cosals = await Promise.all(
        this.docs
          .filter(({ createdAt }) => createdAt > this.lastIndex)
          .map(async doc => await toCosal(doc)),
      )
      console.log('cosals are', cosals)

      cosals.forEach(cosal => {
        this.cosals[cosal.id] = cosal
      })

      this.lastIndex = +Date.now()
      console.timeEnd(s)
    },
  ]

  // keep last tree so we can dispose of it
  tree = null

  @react({ log: false })
  getNearest = [
    () => this.lastIndex,
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

  search = async (doc: Doc): Array<{ weight: number; doc: Doc }> => {
    const { vector } = await toCosal(doc)
    const candidates = this.getNearest(vector, 30)

    const similarities = await mCosSimilarities(
      vector,
      candidates.map(id => this.cosals[id].vector),
    )

    const docs = similarities.map((similarity, index) => ({
      similarity,
      bit: this.bitById[candidates[index]],
    }))

    return reverse(sortBy(docs, 'similarity')) //reverse(sortBy(this.addExactMatch(docs), 'similarity'))
  }

  salientDocs = async (
    docCosals: Array<DocCosal>,
  ): Array<{ weight: number; doc: Doc }> => saliency(docCosals, this.docCosals)
}
