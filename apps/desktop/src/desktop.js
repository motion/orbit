// @flow
import Server from './server'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import ScreenMaster from './screenMaster'
import Screen from '@mcro/screen'
import * as Helpers from '~/helpers'
import { store, debugState } from '@mcro/black'
import global from 'global'
import Path from 'path'

const log = debug('desktop')

const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)

@store
export default class Desktop {
  server = new Server()
  screen = new ScreenMaster()
  stores = null

  async start() {
    global.App = this
    this.setupHosts()
    const port = await this.server.start()
    log(`starting desktop on ${port}`)
    this.screen.start()
    this.watchBrowserOpen()
    debugState(({ stores }) => {
      this.stores = stores
    })
  }

  restart() {
    require('touch')(Path.join(__dirname, '..', 'package.json'))
  }

  watchBrowserOpen() {
    this.react(() => Screen.appState.openBrowser, url => Helpers.open(url))
  }

  dispose = async () => {
    if (this.disposed) return false
    await this.screen.dispose()
    this.disposed = true
    log('screen disposed, returning...')
    return true
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
