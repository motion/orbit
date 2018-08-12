import { BitEntity } from './entities/BitEntity'
import { SettingEntity } from './entities/SettingEntity'
import { Syncers } from './syncer'
import Server from './Server'
import { Screen } from './Screen'
import { KeyboardStore } from './stores/keyboardStore'
import hostile_ from 'hostile'
import { getConfig } from './config'
import { promisifyAll } from 'sb-promisify'
import sudoPrompt_ from 'sudo-prompt'
import { handleEntityActions } from './sqlBridge'
import { App, Electron, Desktop } from '@mcro/stores'
import { debugState, on } from '@mcro/black'
import root from 'global'
import Path from 'path'
import open from 'opn'
// import iohook from 'iohook'
import { Connection } from 'typeorm'
import { GeneralSettingManager } from './settingManagers/GeneralSettingManager'
import macosVersion from 'macos-version'
import { Server as WebSocketServer } from 'ws'
import connectModels from './helpers/connectModels'
import { Entities } from './entities'
import { Onboard } from './onboard/Onboard'
import { Logger, logger } from '@mcro/logger'
import { getConfig as getConfigGlobal } from '@mcro/config'

const log = logger('desktop')
const hostile = promisifyAll(hostile_)
const sudoPrompt = promisifyAll(sudoPrompt_)
const Config = getConfig()

export class Root {
  isReconnecting = false
  connection?: Connection
  onboard: Onboard
  disposed = false
  screen: Screen
  keyboardStore: KeyboardStore
  generalSettingManager: GeneralSettingManager
  server = new Server()
  stores = null

  start = async () => {
    this.registerREPLGlobals()
    this.registerEntityServer()
    log('Start Desktop Store..')
    // iohook.start(false)
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
    if (!(await SettingEntity.findOne({ type: 'confluence' }))) {
      const setting = new SettingEntity()
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

    this.onboard = new Onboard()
    this.generalSettingManager = new GeneralSettingManager()
    // no need to wait for them...
    // this.startSyncers()
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
    this.connection = await connectModels(Entities)
  }

  watchLastBit = () => {
    async function updateLastBit() {
      const lastBit = await BitEntity.findOne({
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

  dispose = async () => {
    if (this.disposed) {
      return
    }
    if (this.screen) {
      await this.screen.dispose()
    }
    await this.stopSyncers()
    this.disposed = true
    return true
  }

  setupHosts = async () => {
    const lines = await hostile.get(true)
    const exists = lines.map(line => line[1]).indexOf(Config.server.host) > -1
    if (!exists) {
      log('Adding host entry', Config.server.host)
      await sudoPrompt.exec(`npx hostile set 127.0.0.1 ${Config.server.host}`, {
        name: 'Orbit',
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
    root.Logger = Logger
    root.Syncers = Syncers.reduce((map, syncer) => {
      // since Syncers is an array we need to convert it to object
      // to make them more usable in the REPL.
      // we are using Syncer constructor name as an object key.
      map[syncer.options.constructor.name] = syncer
      return map
    }, {})
  }

  /**
   * Registers a websocket server which is responsible
   * for communication between processes.
   */
  private registerEntityServer() {
    const server = new WebSocketServer({
      port: getConfigGlobal().ports.dbBridge,
    })
    server.on('connection', socket => {
      socket.on('message', str => {
        // @ts-ignore TODO
        handleEntityActions(socket, JSON.parse(str))
      })
    })
  }

  /**
   * Starts all the syncers.
   */
  private async startSyncers() {
    await Promise.all(
      Syncers.map(syncer => {
        return syncer.start()
      }),
    )
  }

  /**
   * Stops all the syncers.
   */
  private async stopSyncers() {
    await Promise.all(
      Syncers.map(syncer => {
        return syncer.stop()
      }),
    )
  }
}
