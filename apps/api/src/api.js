import Server from './server'
import Bootstrap from './bootstrap'

export default class API {
  constructor(options) {
    this.server = new Server(options)
    this.bootstrap = new Bootstrap(options)
    return this
  }

  start() {
    this.bootstrap.start()
    this.server.start()
  }
}
