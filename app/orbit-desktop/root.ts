import connectModels from './helpers/connectModels'
import Server from './Server'
import { Screen } from './Screen'
import { KeyboardStore } from './stores/keyboardStore'
import hostile_ from 'hostile'
import * as Constants from './constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import { Sync } from './sync'
import SQLiteServer from './SQLiteServer'
import { App, Electron, Desktop } from '@mcro/stores'
// import { sleep } from '@mcro/helpers'
import { store, debugState, on } from '@mcro/black'
import root from 'global'
import Path from 'path'
import open from 'opn'
// import iohook from 'iohook'
import debug from '@mcro/debug'
import { Bit, Setting, modelsList } from '@mcro/models'
import { Connection } from 'typeorm'
import { GeneralSettingManager } from './settingManagers/GeneralSettingManager'
import sqlite from 'sqlite'
import macosVersion from 'macos-version'

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
  keyboardStore: KeyboardStore
  generalSettingManager: GeneralSettingManager
  server = new Server()
  sqlite: SQLiteServer
  stores = null

  start = async () => {
    // iohook.start(false)
    root.Root = this
    root.restart = this.restart
    const db = await sqlite.open(
      Path.join(__dirname, '..', 'app_data', 'database'),
      {
        // @ts-ignore
        cached: true,
        promise: Promise,
      },
    )
    this.sqlite = new SQLiteServer({ db })
    await Desktop.start({
      ignoreSelf: true,
      master: true,
      stores: {
        App,
        Electron,
        Desktop,
      },
    })
    // set some initial state on desktop
    Desktop.setState({
      operatingSystem: {
        macVersion: macosVersion(),
      },
    })
    Desktop.onMessage(Desktop.messages.OPEN, open)
    await this.connect()

    // rtemp
    if (!(await Setting.findOne({ type: 'confluence' }))) {
      const setting = new Setting()
      setting.type = 'confluence'
      setting.category = 'integration'
      setting.token = 'good'
      setting.values = {
        atlassian: {
          username: 'natewienert@gmail.com',
          password: 'AtlOrbit123',
          domain: 'https://tryorbit2.atlassian.net',
        },
      }
      await setting.save()
    }

    this.generalSettingManager = new GeneralSettingManager()
    this.sync = new Sync()
    this.sync.start()
    this.screen = new Screen()
    this.keyboardStore = new KeyboardStore({
      onKeyClear: this.screen.lastScreenChange,
    })
    this.keyboardStore.start()
    this.watchLastBit()
    this.setupHosts()
    await this.server.start()
    this.screen.start()
    debugState(({ stores }) => {
      this.stores = stores
    })
    // temp: get context
    // setInterval(async () => {
    //   if (Desktop.appState.name === 'Chrome') {
    //     const { selection } = await getChromeContext()
    //     Desktop.setAppState({ selectedText: selection })
    //   }
    // }, 3000)
  }

  async connect() {
    this.connection = await connectModels(modelsList)
  }

  watchLastBit = () => {
    async function updateLastBit() {
      const lastBit = await Bit.findOne({
        order: { updatedAt: 'DESC' },
      })
      const updatedAt = `${lastBit ? lastBit.updatedAt : ''}`
      Desktop.setLastBitUpdatedAt(updatedAt)
    }
    on(this, setInterval(updateLastBit, 10000))
    updateLastBit()
  }

  restart = () => {
    require('touch')(Path.join(__dirname, '..', '_', 'index.js'))
  }

  reconnect = async () => {
    console.log('reconnect is broken')
    return
    if (this.isReconnecting) {
      return
    }
    this.isReconnecting = true
    if (this.connection) {
      console.log('!!!!!!!!!!!! closing old connection...')
      this.connection.close()
    }
    await this.connect()
    this.isReconnecting = false
  }

  dispose = async () => {
    if (this.disposed) {
      return
    }
    if (this.screen) {
      await this.screen.dispose()
    }
    this.sync.dispose()
    this.disposed = true
    return true
  }

  setupHosts = async () => {
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
