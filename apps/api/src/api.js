// @flow
import Server from './server'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import debug from 'debug'
import Screen from './screen'

const log = debug('api')

log('IS_PROD', Constants.IS_PROD)

const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)

export default class API {
  server: Server
  screen: Screen

  constructor() {
    this.server = new Server()
    this.screen = new Screen()
  }

  async start() {
    log('starting api...')
    this.setupHosts()
    const port = this.server.start()
    log('On port', port)
    this.screen.start()
  }

  dispose() {
    if (this.disposed) return
    this.screen.dispose()
    this.disposed = true
  }

  async setupHosts() {
    const lines = await hostile.get(true)
    const exists = lines.map(line => line[1]).indexOf(Constants.API_HOST) > -1
    if (!exists) {
      log('Adding host entry', Constants.API_HOST)
      await sudoPrompt.exec(`npx hostile set 127.0.0.1 ${Constants.API_HOST}`, {
        name: 'Orbit',
      })
    }
  }
}
