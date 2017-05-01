import Server from './server'

console.log('yes')

export default class API {
  constructor(options) {
    this.server = new Server(options)
    return this
  }

  start() {
    this.server.start()
  }
}
