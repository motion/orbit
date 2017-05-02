import Server from './server'

export default class API {
  constructor(options) {
    this.server = new Server(options)
    return this
  }

  start() {
    this.server.start()
  }
}
