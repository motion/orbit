import { debugState, on } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { Logger, logger } from '@mcro/logger'
import {
  MediatorServer,
  typeormResolvers,
  WebSocketServerTransport,
} from '@mcro/mediator'
import {
  BitModel,
  JobModel,
  PersonBitModel,
  PersonModel,
  SettingModel,
  SettingRemoveCommand,
} from '@mcro/models'
import {
  AtlassianSettingSaveCommand,
  SettingForceSyncCommand,
} from '@mcro/models'
import { App, Desktop, Electron } from '@mcro/stores'
import root from 'global'
import macosVersion from 'macos-version'
import open from 'opn'
import * as Path from 'path'
// import iohook from 'iohook'
import * as typeorm from 'typeorm'
import { Connection } from 'typeorm'
import { Server as WebSocketServer } from 'ws'
import { Entities } from './entities'
import { BitEntity } from './entities/BitEntity'
import { JobEntity } from './entities/JobEntity'
import { PersonBitEntity } from './entities/PersonBitEntity'
import { PersonEntity } from './entities/PersonEntity'
import { SettingEntity } from './entities/SettingEntity'
import connectModels from './helpers/connectModels'
import { Onboard } from './onboard/Onboard'
import { AtlassianSettingSaveResolver } from './resolvers/AtlassianSettingSaveResolver'
import { SettingForceSyncResolver } from './resolvers/SettingForceSyncResolver'
import { SettingRemoveResolver } from './resolvers/SettingRemoveResolver'
import { ScreenManager } from './managers/ScreenManager'
import { DatabaseManager } from './managers/DatabaseManager'
import { GeneralSettingManager } from './managers/GeneralSettingManager'
import Server from './Server'
import { handleEntityActions } from './sqlBridge'
import { KeyboardStore } from './stores/KeyboardStore'
import { Syncers } from './syncer'
import { SyncerGroup } from './syncer/core/SyncerGroup'
import { Oracle } from '@mcro/oracle'
import { AppsManager } from './managers/appsManager'
import { oracleOptions } from './constants'

const log = logger('desktop')

export class Root {
  oracle: Oracle
  isReconnecting = false
  connection?: Connection
  onboard: Onboard
  disposed = false
  keyboardStore: KeyboardStore
  server = new Server()
  stores = null
  mediatorServer: MediatorServer

  // managers
  appsManager: AppsManager
  screenManager: ScreenManager
  generalSettingManager: GeneralSettingManager
  databaseManager: DatabaseManager

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
    this.registerMediatorServer()

    this.databaseManager = new DatabaseManager()
    this.databaseManager.start()
    this.onboard = new Onboard()
    this.generalSettingManager = new GeneralSettingManager()
    // no need to wait for them...
    await this.startSyncers()

    // start managers...
    this.screenManager = new ScreenManager()
    await this.screenManager.start()

    this.appsManager = new AppsManager({
      onAction: (id, action) => {
        Desktop.sendMessage(
          Electron,
          Electron.messages.APP_STATE,
          JSON.stringify({ id, action }),
        )
      },
    })

    this.keyboardStore = new KeyboardStore({
      onKeyClear: this.screenManager.lastScreenChange,
    })
    this.keyboardStore.start()
    this.watchLastBit()
    await this.server.start()
    debugState(({ stores }) => {
      this.stores = stores
    })
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
    require('touch')(Path.join(__dirname, '..', 'package.json'))
  }

  dispose = async () => {
    if (this.disposed) {
      return
    }
    if (this.screenManager) {
      await this.screenManager.dispose()
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
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private registerMediatorServer() {
    this.mediatorServer = new MediatorServer({
      models: [SettingModel, BitModel, JobModel, PersonModel, PersonBitModel],
      commands: [
        SettingRemoveCommand,
        SettingForceSyncCommand,
        AtlassianSettingSaveCommand,
      ],
      transport: new WebSocketServerTransport({
        port: getGlobalConfig().ports.dbBridge,
      }),
      resolvers: [
        ...typeormResolvers(this.connection, [
          { entity: SettingEntity, models: [SettingModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: JobEntity, models: [JobModel] },
          { entity: PersonEntity, models: [PersonModel] },
          { entity: PersonBitEntity, models: [PersonBitModel] },
        ]),
        SettingRemoveResolver,
        SettingForceSyncResolver,
        AtlassianSettingSaveResolver,
      ],
    })
    this.mediatorServer.bootstrap()
  }

  /**
   * Registers a websocket server which is responsible
   * for communication between processes.
   */
  private registerEntityServer() {
    const server = new WebSocketServer({
      port: 9876, // temporary port, this code should be removed
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
