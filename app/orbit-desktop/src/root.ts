import { BitEntity } from './entities/BitEntity'
import { SettingEntity } from './entities/SettingEntity'
import { Syncers } from './syncer'
import Server from './Server'
import { Screen } from './Screen'
import { KeyboardStore } from './stores/keyboardStore'
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
import * as typeorm from 'typeorm'
import { SyncerGroup } from './syncer/core/SyncerGroup'
import { getConfig as getConfigGlobal } from '@mcro/config'

const log = logger('desktop')

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
    Desktop.onMessage(Desktop.messages.OPEN, url => {
      console.log('opening', url)
      open(url)
    })
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
    // await this.startSyncers()
    this.screen = new Screen()
    this.keyboardStore = new KeyboardStore({
      onKeyClear: this.screen.lastScreenChange,
    })
    this.keyboardStore.start()
    this.watchLastBit()
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

  /**
   * Registers global variables in the REPL.
   * Used for the development purposes.
   */
  private registerREPLGlobals() {
    root.typeorm = typeorm
    root.Root = this
    root.restart = this.restart
    root.Logger = Logger
    root.Syncers = Syncers.reduce((map, syncerOrGroup) => {
      // since Syncers is an array we need to convert it to object
      // to make them more usable in the REPL.
      // we are using Syncer constructor name as an object key.
      if (syncerOrGroup instanceof SyncerGroup) {
        map[syncerOrGroup.name] = syncerOrGroup
        for (let syncer of syncerOrGroup.syncers) {
          map[syncer.name] = syncer
        }
      } else {
        map[syncerOrGroup.name] = syncerOrGroup
      }
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
        handleEntityActions(
          socket,
          typeof str === 'string' ? JSON.parse(str) : str,
        )
      })
    })
  }

  /**
   * Starts all the syncers.
   * We start syncers in a small timeout to prevent app-overload.
   */
  private async startSyncers() {
    setTimeout(
      () =>
        Promise.all(
          Syncers.map(syncer => {
            return syncer.start()
          }),
        ),
      5000,
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
