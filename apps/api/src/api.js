// @flow
import Database, { Models } from '@mcro/models'
import Server from './server'
import Bootstrap from './bootstrap'
import Jobs from './jobs'
import type { Options } from '~/types'
import adapter from 'pouchdb-adapter-memory'

// import Slouch from 'couch-slouch'
// const slouch = new Slouch('http://admin:password@pad-couch:5984')
// let docs = []
// slouch.doc
//   .all('users', { include_docs: true })
//   .each(item => {
//     console.log('got item', item)
//     // return Promise.resolve(item)
//   })
//   .then(allDocs => {
//     console.log('all are', allDocs)
//   })

export default class API {
  constructor(options: Options) {
    this.server = new Server(options)
    this.bootstrap = new Bootstrap(options)
    this.jobs = new Jobs(options)
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
    this.bootstrap.start()
    this.server.start()

    // things that depend on models go after this line
    await this.database.start({
      modelOptions: {
        autoSync: true,
      },
    })

    await this.jobs.start()
  }

  dispose() {
    this.bootstrap.dispose()
    this.server.dispose()
    this.jobs.dispose()
  }
}
