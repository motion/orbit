import { Syncers } from '~/syncer'
import connectModels from './helpers/connectModels'
import Server from './Server'
import { Plugins } from './plugins'
import { Screen } from './Screen'
import { KeyboardStore } from './stores/keyboardStore'
import { Auth } from './Auth'
import hostile_ from 'hostile'
import * as Constants from './constants'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
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
  screen: Screen
  plugins: Plugins
  keyboardStore: KeyboardStore
  generalSettingManager: GeneralSettingManager
  auth: Auth
  server = new Server()
  sqlite: SQLiteServer
  stores = null

  start = async () => {
    this.registerREPLGlobals();
    // iohook.start(false)
    const db = await sqlite.open(
      Path.join(__dirname, '..', 'data', 'database'),
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
    // requires desktop to be started
    this.auth = new Auth()
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
    await this.startSyncers();
    this.screen = new Screen()
    this.plugins = new Plugins({
      server: this.server,
    })
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
    await this.stopSyncers();
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

  /**
   * Registers global variables in the REPL.
   * Used for the development purposes.
   */
  private registerREPLGlobals() {
    root.Root = this
    root.restart = this.restart
    root.Syncers = Syncers.reduce((map, syncer) => {

      // since Syncers is an array we need to convert it to object
      // to make them more usable in the REPL. We are using Syncer type
      // as an object key. Since Syncers can have duplicate types
      // we apply ordered number to syncers with duplicated types
      const sameTypeSyncersNumber = Object
        .keys(map)
        .filter(key => key === syncer.options.type)
        .length
      const suffix = (sameTypeSyncersNumber > 0 ? sameTypeSyncersNumber : '')
      map[syncer.options.type + suffix] = syncer
      return map
    }, {});
  }

  /**
   * Starts all the syncers.
   */
  private async startSyncers() {
    await Promise.all(Syncers.map(syncer => {
      return syncer.start()
    }))
  }

  /**
   * Stops all the syncers.
   */
  private async stopSyncers() {
    await Promise.all(Syncers.map(syncer => {
      return syncer.stop()
    }))
  }

}
