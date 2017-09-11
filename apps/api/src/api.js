// @flow
import Database, { Models } from '@mcro/models'
import Server from './server'
import Bootstrap from './bootstrap'
import Jobs from './jobs'
import type { Options } from '~/types'
import adapter from 'pouchdb-adapter-memory'
import * as Constants from '~/constants'

export default class API {
  server: Server
  bootstrap: Bootstrap
  jobs: Jobs
  database: Database

  constructor(options: Options) {
    this.server = new Server(options)
    this.bootstrap = new Bootstrap(options)
    this.jobs = new Jobs()
    console.log('Connecting to couch', Constants.DB_URL, Constants.DB_HOST)
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
    console.log('Start database')
    await this.database.start({
      modelOptions: {
        autoSync: true,
        debug: true,
      },
    })
    console.log('Start bootstrap')
    this.bootstrap.start()
    console.log('Start server')
    this.server.start()
    console.log('Start jobs')
    await this.jobs.start()
  }

  dispose() {
    this.bootstrap.dispose()
    this.server.dispose()
    this.jobs.dispose()
  }
}
