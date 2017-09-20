// @flow
import Server from './server'
import type { Options } from '~/types'

export default class API {
  server: Server

  constructor(options: Options) {
    this.server = new Server(options)
  }

  async start() {
    const port = this.server.start()
    console.log('API on port', port)
  }

  dispose() {
    this.server.dispose()
  }
}
