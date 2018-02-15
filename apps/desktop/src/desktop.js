// @flow
import Server from './server'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import debug from 'debug'
import ScreenMaster from './screenMaster'
import Screen from '@mcro/screen'
import * as Helpers from '~/helpers'
import { store } from '@mcro/black/store'

const log = debug('desktop')

log('IS_PROD', Constants.IS_PROD)

const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)

@store
export default class Desktop {
  server: Server
  screen: Screen

  constructor() {
    this.server = new Server()
    this.screenMaster = new ScreenMaster()
  }

  async start() {
    this.setupHosts()
    const port = await this.server.start()
    log(`starting desktop on ${port}`)
    this.screenMaster.start()
    this.watchBrowserOpen()
  }

  watchBrowserOpen() {
    this.react(() => Screen.appState.openBrowser, url => Helpers.open(url))
  }

  dispose() {
    if (this.disposed) return
    this.screenMaster.dispose()
    this.disposed = true
  }

  async setupHosts() {
    const lines = await hostile.get(true)
    const exists = lines.map(line => line[1]).indexOf(Constants.API_HOST) > -1
    if (!exists) {
      log(`Adding host entry`, Constants.API_HOST)
      await sudoPrompt.exec(`npx hostile set 127.0.0.1 ${Constants.API_HOST}`, {
        name: `Orbit`,
      })
    }
  }
}
