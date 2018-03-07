// @flow
import Server from './server'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import ScreenMaster from './screenMaster'
import { App } from '@mcro/all'
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
  screenMaster = new ScreenMaster()
  stores = null

  async start() {
    global.Root = this
    this.setupHosts()
    const port = await this.server.start()
    log(`starting desktop on ${port}`)
    this.screenMaster.start()
    this.watchBrowserOpen()
    debugState(({ stores }) => {
      this.stores = stores
    })
  }

  restart() {
    require('touch')(Path.join(__dirname, '..', 'lib', 'index.js'))
  }

  watchBrowserOpen() {
    this.react(() => App.state.openBrowser, url => Helpers.open(url))
  }

  dispose = async () => {
    if (this.disposed) return false
    await this.screenMaster.dispose()
    this.disposed = true
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
