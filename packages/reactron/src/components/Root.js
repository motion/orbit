import { app } from 'electron'

export default class Root {
  constructor() {
    console.log('make container', app)
    this.app = app
  }
}
