// @flow
import Server from './server'
import Database, { Models } from '@mcro/models'
import PouchAdapterMemory from 'pouchdb-adapter-memory'

export default class API {
  server: Server
  // database: Database

  constructor() {
    this.database = new Database(
      {
        name: 'username',
        password: 'password',
        adapter: PouchAdapterMemory,
        adapterName: 'memory',
      },
      Models
    )
    const pouch = this.database.pouch
    this.server = new Server({ pouch })
  }

  async start() {
    const port = this.server.start()
    await this.database.start({
      modelOptions: {
        debug: true,
      },
    })
    console.log('API on port', port)
  }

  dispose() {
    this.server.dispose()
  }
}
