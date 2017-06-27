import Server from './server'
import Bootstrap from './bootstrap'
import type { Options } from '~/types'

export default class API {
  constructor(options: Options) {
    this.server = new Server(options)
    this.bootstrap = new Bootstrap(options)
    return this
  }

  start() {
    this.bootstrap.start()
    this.server.start()
  }

  dispose() {
    this.bootstrap.dispose()
    this.server.dispose()
  }
}
