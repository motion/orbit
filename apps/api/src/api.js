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
import type { Options } from '~/types'
const adapter = require('pouchdb-adapter-memory')
console.log(++i)

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
  }

  async start() {
    // things that depend on models go after this line
    console.log('Start database')
    await this.database.start({
      modelOptions: {
        autoSync: true,
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
