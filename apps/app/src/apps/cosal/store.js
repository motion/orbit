import Cosal from '@mcro/cosal'
import { react, store } from '@mcro/black'
import pgText from './pg'
const pg = pgText.split('\n')

@store
export default class CosalStore {
  query = ''
  loading = false

  async willMount() {
    this.cosal = new Cosal()
    // await this.cosal.warm()
    await this.cosal.addDocuments(
      pg.map(content => ({
        id: Math.random() + '',
        fields: [{ weight: 1, content }],
        createdAt: +Date.now(),
      })),
    )
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
      const vals = await this.cosal.search({
        id: Math.random() + '',
        fields: [{ weight: 1, content: this.query }],
        createdAt: +Date.now(),
      })

      return vals
    },
  ]
}
