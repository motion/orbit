// @flow
import Database, { Models } from '@mcro/models'
import Server from './server'
import Bootstrap from './bootstrap'
import Jobs from './jobs'
import type { Options } from '~/types'
import adapter from 'pouchdb-adapter-memory'

export default class API {
  server: Server
  bootstrap: Bootstrap
  jobs: Jobs
  database: Database

  constructor(options: Options) {
    this.server = new Server(options)
    this.bootstrap = new Bootstrap(options)
    this.jobs = new Jobs()
    this.database = new Database(
      {
        name: 'username',
        password: 'password',
        couchUrl: 'http://admin:password@pad-couch:5984',
        couchHost: 'pad-couch:5984',
        adapter,
        adapterName: 'memory',
      },
      Models
    )
    return this
  }

  async start() {
    // things that depend on models go after this line
    await this.database.start({
      modelOptions: {
        autoSync: true,
      },
    })

    this.bootstrap.start()
    this.server.start()

    await this.jobs.start()
  }

  dispose() {
    this.bootstrap.dispose()
    this.server.dispose()
    this.jobs.dispose()
  }
}
