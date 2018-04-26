import Cosal from '@mcro/cosal'
import { App, Desktop } from '@mcro/all'
import { uniqBy, isNumber } from 'lodash'
import { react, store } from '@mcro/black'
import { Bit } from '@mcro/models'

const filterText = (text: string): string => {
  return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
}

@store
export default class CosalStore {
  loading = true
  cosal = new Cosal()
  lastIndex = 0

  bitToDoc = ({ id, body, createdAt }) => ({
    id,
    fields: [{ weight: 1, content: filterText(body) }],
    createdAt: createdAt,
  })

  async willMount() {
    const startingHistory = 150

    const bits: any = uniqBy(await Bit.find({ take: startingHistory }), 'id')
    this.lastIndex = +Date.now()
    // await this.cosal.warm()
    await this.cosal.addDocuments(bits.map(this.bitToDoc))
    console.log('rewriting summaries')
    /*
    bits.forEach(async bit => {
      if (true || !bit.data.summary) {
        const cosal = this.cosal.cosals[bit.id]
        bit.data.summary = this.cosal.getSummary(cosal)
        await bit.save()
      }
    })
    */
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
  getResults = async query => {
    if (this.loading) {
      return []
    }

    const vals = await this.cosal.search({
      id: Math.random() + '',
      fields: [{ weight: 1, content: query }],
      createdAt: +Date.now(),
    })

    console.log('returning for query', query)
    return vals.filter(({ similarity }) => !isNaN(similarity)).slice(0, 10)
  }

  @react
  setSimilarBits = [
    () => App.state.selectedItem,
    async item => {
      const content = item.body
      const results = await this.getResults(content)
      const similarBits = results
        .map(({ id }) => id)
        .filter(id => +id !== +item.id)
      Desktop.setSearchState({
        similarBits,
      })
    },
  ]

  @react
  setSearch = [
    () => App.state.query,
    async query => {
      const results = await this.getResults(query)
      console.log('results are', results)
      Desktop.setSearchState({ searchResults: results.map(({ id }) => id) })
    },
  ]
}
