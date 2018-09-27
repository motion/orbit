import { debugState } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
// import iohook from 'iohook'
import { Cosal } from '@mcro/cosal'
import { BitEntity, JobEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { MediatorClient, MediatorServer, typeormResolvers, WebSocketServerTransport } from '@mcro/mediator'
import {
  AtlassianSettingSaveCommand,
  BitModel,
  CosalTopWordsCommand,
  GithubRepositoryModel,
  GithubSettingBlacklistCommand,
  JobModel,
  PersonBitModel,
  PersonModel,
  SettingModel,
  SettingRemoveCommand,
  SlackChannelModel,
  SlackSettingBlacklistCommand,
} from '@mcro/models'
import { Oracle } from '@mcro/oracle'
import { App, Desktop, Electron } from '@mcro/stores'
import root from 'global'
import macosVersion from 'macos-version'
import open from 'opn'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { Connection } from 'typeorm'
import { oracleOptions } from './constants'
import { AppsManager } from './managers/appsManager'
import { CosalManager } from './managers/CosalManager'
import { DatabaseManager } from './managers/DatabaseManager'
import { GeneralSettingManager } from './managers/GeneralSettingManager'
import { OCRManager } from './managers/OCRManager'
import { ScreenManager } from './managers/ScreenManager'
import { Onboard } from './onboard/Onboard'
import { AtlassianSettingSaveResolver } from './resolvers/AtlassianSettingSaveResolver'
import { CosalTopWordsResolver } from './resolvers/CosalTopWordsResolver'
import { GithubRepositoryManyResolver } from './resolvers/GithubRepositoryResolver'
import { SettingRemoveResolver } from './resolvers/SettingRemoveResolver'
import { SlackChannelManyResolver } from './resolvers/SlackChannelResolver'
import { Server } from './Server'
import { KeyboardStore } from './stores/KeyboardStore'

const log = new Logger('desktop')

export class Root {
  config = getGlobalConfig()
  oracle: Oracle
  isReconnecting = false
  connection?: Connection
  onboard: Onboard
  disposed = false
  keyboardStore: KeyboardStore
  server = new Server()
  stores = null
  mediatorServer: MediatorServer
  cosal: Cosal

  // managers
  cosalManager: CosalManager
  ocrManager: OCRManager
  appsManager: AppsManager
  screenManager: ScreenManager
  generalSettingManager: GeneralSettingManager
  databaseManager: DatabaseManager

  start = async () => {
    log.verbose('Start Desktop Store..')
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

    // BEFORE YOUR CONNECT
    // run the databaseManager that runs migrations
    // this ensures things dont err
    this.databaseManager = new DatabaseManager()
    await this.databaseManager.start()
    this.connection = this.databaseManager.getConnection()

    this.registerMediatorServer()

    this.onboard = new Onboard()
    this.generalSettingManager = new GeneralSettingManager()

    // setup oracle to pass into managers
    this.oracle = new Oracle({
      ...oracleOptions,
      appWindow: true,
    })

    this.oracle.onError(err => {
      console.log('Oracle error', err)
    })

    // start managers...

    this.cosal = new Cosal()
    this.ocrManager = new OCRManager({ cosal: this.cosal })
    this.cosalManager = new CosalManager({ cosal: this.cosal })
    this.screenManager = new ScreenManager({ oracle: this.oracle })
    this.appsManager = new AppsManager()

    // start oracle after passing into screenManager
    await this.oracle.start()
    // then start screenmanager after oracle.start
    this.screenManager.start()
    // start oracle related managers once its started
    this.ocrManager.start()

    // start others...
    this.keyboardStore = new KeyboardStore({
      // disable for now it was used for fancy orbit app switching
      // onKeyClear: this.screenManager.lastScreenChange,
    })
    this.keyboardStore.start()
    await this.server.start()

    // this watches for store mounts/unmounts and attaches them here for debugging
    debugState(({ stores }) => {
      this.stores = stores
    })

    this.registerREPLGlobals()
  }

  restart = () => {
    require('touch')(Path.join(__dirname, '..', '_', 'main.js'))
  }

  dispose = async () => {
    console.log('Disposing Desktop.Root')
    if (this.disposed) {
      return
    }
    Desktop.dispose()
    if (this.appsManager) {
      await this.appsManager.dispose()
    }
    await this.ocrManager.dispose()
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
    root.mediatorServer = this.mediatorServer
    // root.load = async (email: string) => {
    //   console.time("timing")
    //   const bits = getRepository(BitEntity).find({
    //     where: {
    //       people: {
    //         personBit: {
    //           email: email,
    //         },
    //       },
    //     },
    //     order: {
    //       bitUpdatedAt: 'DESC',
    //     },
    //     take: 15,
    //   })
    //   console.timeEnd("timing")
    //   return bits
    // }
    // root.save = async (count: number) => {
    //   const setting = await getRepository(SettingEntity).findOne(1)
    //   const bitCount = await getRepository(BitEntity).count()
    //   const bits: any[] = []
    //   for (let i = 0; i < count; i++) {
    //     bits.push(BitUtils.create({
    //       id: 400000 + bitCount + i,
    //       integration: 'test' as any,
    //       title: '4My bit #' + (bitCount + i),
    //       body: '',
    //       type: 'custom',
    //       bitCreatedAt: Date.now(),
    //       bitUpdatedAt: Date.now(),
    //       settingId: setting.id,
    //     }))
    //   }
    //   console.log("saving bit", bits)
    //   console.time("saving bits")
    //   await getRepository(BitEntity).save(bits, { chunk: 100 })
    //   console.timeEnd("saving bits")
    // }
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private registerMediatorServer() {
    this.mediatorServer = new MediatorServer({
      models: [
        SettingModel,
        BitModel,
        JobModel,
        PersonModel,
        PersonBitModel,
        GithubRepositoryModel,
        SlackChannelModel,
      ],
      commands: [
        SettingRemoveCommand,
        AtlassianSettingSaveCommand,
        GithubSettingBlacklistCommand,
        SlackSettingBlacklistCommand,
        CosalTopWordsCommand,
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
        AtlassianSettingSaveResolver,
        GithubRepositoryManyResolver,
        SlackChannelManyResolver,
        CosalTopWordsResolver,
      ],
    })
    this.mediatorServer.bootstrap()
  }
}
