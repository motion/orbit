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

  async willMount() {
    const bits: any = uniqBy(await Bit.find({ take: 1500 }), 'title')
    await this.cosal.warm()
    await this.cosal.addDocuments(
      bits.map(({ id, title }) => ({
        id,
        fields: [{ weight: 1, content: title }],
        createdAt: +Date.now(),
      })),
    )
    this.cosal.docsVersion += 1
    this.loading = false
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
