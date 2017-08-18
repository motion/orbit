// @flow
import Models from '@mcro/models'
import * as AllModels from '@mcro/models'
import Server from './server'
import Bootstrap from './bootstrap'
import Jobs from './jobs'
import type { Options } from '~/types'

export default class API {
  constructor(options: Options) {
    this.server = new Server(options)
    this.bootstrap = new Bootstrap(options)
    this.jobs = new Jobs(options)
    this.models = new Models(
      {
        name: 'username',
        password: 'password',
        couchUrl: 'http://api.jot.dev',
        couchHost: 'api.jot.dev',
      },
      AllModels
    )
    return this
  }

  async start() {
    this.bootstrap.start()
    this.server.start()

    // things that depend on models go after this line
    await this.models.start()

    this.jobs.start()
  }

  dispose() {
    this.bootstrap.dispose()
    this.server.dispose()
    this.jobs.dispose()
  }
}
