import Cosal from '@mcro/cosal'
import { App, Desktop } from '@mcro/all'
import { uniqBy } from 'lodash'
import { react, store } from '@mcro/black'
import { Bit } from '@mcro/models'

@store
export default class CosalStore {
  query = ''
  loading = true
  cosal = new Cosal()
  lastIndex = 0

  bitToDoc = ({ id, title, createdAt }) => ({
    id,
    fields: [{ weight: 1, content: title }],
    createdAt: createdAt,
  })

  async willMount() {
    const startingHistory = 3000

    const bits: any = uniqBy(await Bit.find({ take: startingHistory }), 'id')
    this.lastIndex = +Date.now()
    await this.cosal.warm()
    const start = +Date.now()
    await this.cosal.addDocuments(bits.map(this.bitToDoc))
    this.cosal.docsVersion += 1
    // @ts-ignore
    this.setTimeout(this.updateSince, 10000)
    this.loading = false
  }

  updateSince = async () => {
    const bitsSince: any = await Bit.createQueryBuilder()
      .where(`createdAt > '${new Date(this.lastIndex).toISOString()}'`)
      .getMany()
    const bits: any = uniqBy(bitsSince, 'id')
    await this.cosal.addDocuments(bits.map(this.bitToDoc))
    this.cosal.docsVersion += 1
    this.lastIndex = +Date.now()
    // @ts-ignore
    this.setTimeout(this.updateSince)
  }

  // @ts-ignore
  @react
  results = [
    () => App.state.query,
    async query => {
      if (this.loading) {
        return []
      }
      const vals = await this.cosal.search({
        id: Math.random() + '',
        fields: [{ weight: 1, content: query }],
        createdAt: +Date.now(),
      })

      return vals.slice(0, 10)
    },
  ]

  @react
  setSearch = [
    () => this.results,
    results => {
      Desktop.setSearchState({ searchResults: results.map(({ id }) => id) })
    },
  ]
}
