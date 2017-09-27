// @flow
import Server from './server'
import Database, { Models, User } from '@mcro/models'
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
    global.pouch = pouch
    this.server = new Server({ pouch })
  }

  async start() {
    const port = this.server.start()
    await this.database.start({
      modelOptions: {
        debug: true,
      },
    })
    await User.create({ id: 'boo' })

    console.log('API on port', port)
  }

  dispose() {
    this.server.dispose()
  }
}
