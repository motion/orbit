// @flow
import Server from './server'
import PouchDBBrowser from 'pouchdb-browser'
import PouchHttp from 'pouchdb-adapter-http'
import PouchMemory from 'pouchdb-adapter-memory'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'

const PouchDB = PouchDBBrowser.plugin(PouchHttp).plugin(PouchMemory)

const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)

export default class API {
  server: Server

  constructor() {
    const pouch = PouchDB.defaults({ adapter: 'memory' })
    this.server = new Server({ pouch })
  }

  async start() {
    this.setupHosts()
    const port = this.server.start()
    console.log('API on port', port)
  }

  dispose() {
    this.server.dispose()
  }

  async setupHosts() {
    const lines = await hostile.get(true)
    const exists = lines.map(line => line[1]).indexOf(Constants.API_HOST) > -1
    if (!exists) {
      await sudoPrompt.exec(`npx hostile set 127.0.0.1 ${Constants.API_HOST}`, {
        name: 'Orbit',
      })
    }
  }
}
