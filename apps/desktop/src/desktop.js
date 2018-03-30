// @flow
import * as Models from '@mcro/models'
import connectModels from './helpers/connectModels'
import Server from './server'
import Plugins from './plugins'
import Screen from './screen'
import KeyboardStore from './stores/keyboardStore'
import Auth from './auth'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import Sync from './sync'
import SQLiteServer from './sqliteServer'
import { App, Electron, Desktop } from '@mcro/all'
import { store, debugState } from '@mcro/black'
import global from 'global'
import Path from 'path'
import { getChromeContext } from './helpers/getContext'
// import SearchStore from './stores/search'
import open from 'opn'
import iohook from 'iohook'

const log = debug('desktop')

const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)

@store
export default class DesktopRoot {
  // searchStore = new SearchStore()
  server = new Server()
  auth = new Auth()
  sqlite = new SQLiteServer()
  stores = null

  async start() {
    global.Root = this
    global.restart = this.restart
    await Desktop.start({
      ignoreSelf: true,
      master: true,
      stores: {
        App,
        Electron,
        Desktop,
      },
    })
    await connectModels(Object.keys(Models).map(x => Models[x]))
    this.sync = new Sync()
    this.sync.start()
    this.screen = new Screen()
    this.plugins = new Plugins({
      server: this.server,
    })
    this.keyboardStore = new KeyboardStore({
      onKeyClear: this.screen.lastScreenChange,
    })
    this.keyboardStore.start()
    iohook.start()
    this.setupHosts()
    await this.server.start()
    this.screen.start()
    debugState(({ stores }) => {
      this.stores = stores
    })
    this.openAppOnSelect()
    // temp: get context
    setInterval(async () => {
      if (Desktop.appState.name === 'Chrome') {
        const { selection } = await getChromeContext()
        Desktop.setSelection(selection)
      }
    }, 3000)
  }

  openAppOnSelect = () => {
    this.react(
      () => App.state.openResult,
      result => {
        if (result && result.id) {
          open(result.id)
        }
      },
    )
  }

  restart() {
    require('touch')(Path.join(__dirname, '..', 'lib', 'index.js'))
  }

  dispose = async () => {
    if (this.disposed) return
    await this.screen.dispose()
    // this.sync.dispose()
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
