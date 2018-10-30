import { debugState } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { Cosal } from '@mcro/cosal'
import { BitEntity, JobEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { MediatorServer, typeormResolvers, WebSocketServerTransport } from '@mcro/mediator'
import {
  SettingSaveCommand,
  BitModel,
  CosalTopWordsCommand,
  GithubRepositoryModel,
  GithubSourceBlacklistCommand,
  JobModel,
  PersonBitModel,
  PersonModel,
  SearchLocationsModel,
  SearchResultModel,
  SalientWordsModel,
  SettingModel,
  SettingRemoveCommand,
  SlackChannelModel,
  SlackSourceBlacklistCommand,
  SearchPinnedResultModel,
  SearchByTopicModel,
} from '@mcro/models'
import { Oracle } from '@mcro/oracle'
import { App, Desktop, Electron } from '@mcro/stores'
import root from 'global'
import macosVersion from 'macos-version'
import open from 'opn'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { getConnection } from 'typeorm'
import { COSAL_DB, oracleOptions } from './constants'
import { writeOrbitConfig } from './helpers'
import { AppsManager } from './managers/appsManager'
import { CosalManager } from './managers/CosalManager'
import { DatabaseManager } from './managers/DatabaseManager'
import { GeneralSettingManager } from './managers/GeneralSettingManager'
import { OCRManager } from './managers/OCRManager'
import { ScreenManager } from './managers/ScreenManager'
import { Onboard } from './onboard/Onboard'
import { SettingSaveResolver } from './resolvers/SettingSaveResolver'
import { getCosalResolvers } from './resolvers/getCosalResolvers'
import { GithubRepositoryManyResolver } from './resolvers/GithubRepositoryResolver'
import { SearchLocationsResolver } from './resolvers/SearchLocationsResolver'
import { getSearchResolver } from './resolvers/SearchResultResolver'
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SettingRemoveResolver } from './resolvers/SettingRemoveResolver'
import { SlackChannelManyResolver } from './resolvers/SlackChannelResolver'
import { Server } from './Server'
import { SearchPinnedResolver } from './resolvers/SearchPinnedResolver'
import { getSearchByTopicResolver } from './resolvers/SearcyByTopicResolver'

const log = new Logger('desktop')

export class Root {
  config = getGlobalConfig()
  oracle: Oracle
  isReconnecting = false
  onboard: Onboard
  disposed = false
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
    log.info('Start Desktop Store..')

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

    // FIRST THING
    // databaserunner runs your migrations which everything can be impacted by...
    // leave it as high up here as possible
    this.databaseManager = new DatabaseManager()
    await this.databaseManager.start()

    this.cosal = new Cosal({
      database: COSAL_DB,
    })
    await this.cosal.start()

    this['x'] = getSearchByTopicResolver(this.cosal)

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

    this.ocrManager = new OCRManager({ cosal: this.cosal })
    this.cosalManager = new CosalManager({ cosal: this.cosal })
    this.screenManager = new ScreenManager({ oracle: this.oracle })
    this.appsManager = new AppsManager()

    // start oracle after passing into screenManager
    await this.oracle.start()
    // then start screenmanager after oracle.start
    // no need to await
    this.screenManager.start()
    // start oracle related managers once its started
    // no need to await
    this.ocrManager.start()

    // order doesnt matter
    this.cosalManager.start()
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
    console.log('writing orbit config...')
    await writeOrbitConfig()
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
        SearchResultModel,
        SalientWordsModel,
        SearchLocationsModel,
        SearchPinnedResultModel,
        SearchByTopicModel,
      ],
      commands: [
        SettingSaveCommand,
        SettingRemoveCommand,
        GithubSourceBlacklistCommand,
        SlackSourceBlacklistCommand,
        CosalTopWordsCommand,
      ],
      transport: new WebSocketServerTransport({
        port: getGlobalConfig().ports.dbBridge,
      }),
      resolvers: [
        // @ts-ignore
        ...typeormResolvers(getConnection(), [
          { entity: SettingEntity, models: [SettingModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: JobEntity, models: [JobModel] },
          { entity: PersonEntity, models: [PersonModel] },
          { entity: PersonBitEntity, models: [PersonBitModel] },
        ]),
        SettingRemoveResolver,
        SettingSaveResolver,
        GithubRepositoryManyResolver,
        SlackChannelManyResolver,
        ...getCosalResolvers(this.cosal),
        getSearchByTopicResolver(this.cosal),
        getSearchResolver(this.cosal),
        getSalientWordsResolver(this.cosal),
        SearchLocationsResolver,
        SearchPinnedResolver,
      ],
    })
    this.mediatorServer.bootstrap()
  }
}
