// @flow
import Database, { Models } from '@mcro/models'
import Server from './server'
import adapter from 'pouchdb-adapter-memory'
import * as Constants from '~/constants'
import type { Options } from '~/types'

export default class API {
  server: Server
  database: Database

  constructor(options: Options) {
    this.server = new Server(options)
    this.database = new Database(
      {
        name: 'username',
        password: 'password',
        couchUrl: Constants.DB_URL,
        couchHost: Constants.DB_HOST,
        adapter,
        adapterName: 'memory',
      },
      Models
    )
  }

  async start() {
    // things that depend on models go after this line
    await this.database.start({
      modelOptions: {
        // autoSync: true,
        debug: true,
      },
    })
    const port = this.server.start()
    console.log('API on port', port)
  }

  dispose() {
    this.server.dispose()
  }
}
