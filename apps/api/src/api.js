// @flow
let i = 0
console.log(++i)
const { default: Database, Models } = require('@mcro/models')
console.log(++i)
const Server = require('./server').default
console.log(++i)
const Bootstrap = require('./bootstrap').default
console.log(++i)
const Jobs = require('./jobs').default
console.log(++i)
import type { Options } from '~/types'
const adapter = require('pouchdb-adapter-memory')
console.log(++i)

export default class API {
  server: Server
  bootstrap: Bootstrap
  jobs: Jobs
  database: Database

  constructor(options: Options) {
    console.log('123')
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
    console.log('done')
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
