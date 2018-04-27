import Cosal from '@mcro/cosal'
import { react, store } from '@mcro/black'
import pgText from './pg'
import { Bit } from '@mcro/models'

const pg = pgText.split('\n')
const filterText = text => {
  return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
}

@store
export default class CosalStore {
  query = ''
  queryCosal = null
  loading = false
  cosal = new Cosal()

  bitToDoc = ({ id, body, createdAt }) => ({
    id,
    fields: [{ weight: 1, content: filterText(body) }],
    createdAt: createdAt,
  })

  async willMount() {
    // await this.cosal.warm()
    const usePG = false

    let docs = []

    if (usePG) {
      docs = pg
        .map(content => ({
          id: Math.random() + '',
          fields: [{ weight: 1, content }],
          createdAt: +Date.now(),
        }))
        .slice(0, 75)
    } else {
      docs = (await Bit.find({ take: 150 })).map(this.bitToDoc)
    }

    await this.cosal.addDocuments(docs)
    this.cosal.docsVersion += 1
    this.loading = false
  }

  // @ts-ignore
  @react
  results = [
    () => this.query,
    async () => {
      if (this.loading) {
        return []
      }

      const doc = {
        id: Math.random() + '',
        fields: [{ weight: 1, content: this.query }],
        createdAt: +Date.now(),
      }
      this.queryCosal = await this.cosal.toCosal(doc)
      const vals = await this.cosal.search(doc)
      console.log('vals are', vals)

      return vals
    },
  ]
}
