import * as Models from '@mcro/models'
import connectModels from './helpers/connectModels'
import Server from './server'
import { Plugins } from './plugins'
import { Screen } from './screen'
import { KeyboardStore } from './stores/keyboardStore'
import { Auth } from './auth'
import hostile_ from 'hostile'
import * as Constants from '~/constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import { Sync } from './sync'
import SQLiteServer from './sqliteServer'
import { App, Electron, Desktop } from '@mcro/stores'
// import { sleep } from '@mcro/helpers'
import { store, debugState } from '@mcro/black'
import root from 'global'
import Path from 'path'
import { getChromeContext } from './helpers/getContext'
import open from 'opn'
import iohook from 'iohook'
import debug from '@mcro/debug'
import { Bit } from '@mcro/models'
import { Connection } from 'typeorm'

const log = debug('desktop')

const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)

@store
export class Root {
  isReconnecting = false
  connection?: Connection
  disposed = false
  sync: Sync
  screen: Screen
  plugins: Plugins
  keyboardStore: KeyboardStore
  server = new Server()
  auth = new Auth()
  sqlite = new SQLiteServer()
  stores = null

  async start() {
    root.Root = this
    root.restart = this.restart
    await Desktop.start({
      ignoreSelf: true,
      master: true,
      stores: {
        App,
        Electron,
        Desktop,
      },
    })
    Desktop.onMessage(Desktop.messages.OPEN, open)
    await this.connect()
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
    iohook.start(false)
    this.watchLastBit()
    this.setupHosts()
    await this.server.start()
    this.screen.start()
    debugState(({ stores }) => {
      this.stores = stores
    })
    // temp: get context
    setInterval(async () => {
      if (Desktop.appState.name === 'Chrome') {
        const { selection } = await getChromeContext()
        Desktop.setAppState({ selectedText: selection })
      }
    }, 3000)
  }

  async connect() {
    this.connection = await connectModels(
      Object.keys(Models).map(x => Models[x]),
    )
  }

  watchLastBit() {
    async function updateLastBit() {
      const lastBit = await Bit.findOne({
        order: { updatedAt: 'DESC' },
      })
      const updatedAt = `${lastBit ? lastBit.updatedAt : ''}`
      Desktop.setLastBitUpdatedAt(updatedAt)
    }
    // @ts-ignore
    this.setInterval(updateLastBit, 10000)
    updateLastBit()
  }

  restart() {
    require('touch')(Path.join(__dirname, '..', '_', 'index.js'))
  }

  async reconnect() {
    if (this.isReconnecting) {
      return
    }
    this.isReconnecting = true
    if (this.connection) {
      console.log('closing old connection...')
      this.connection.close()
    }
    await this.connect()
    this.isReconnecting = false
  }

  dispose = async () => {
    if (this.disposed) {
      return
    }
    await this.screen.dispose()
    this.sync.dispose()
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
