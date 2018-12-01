import { debugState } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { Cosal } from '@mcro/cosal'
import {
  AppEntity,
  BitEntity,
  JobEntity,
  PersonBitEntity,
  PersonEntity,
  SettingEntity,
  SourceEntity,
  SpaceEntity,
} from '@mcro/models'
import { Logger } from '@mcro/logger'
import { MediatorServer, typeormResolvers, WebSocketServerTransport } from '@mcro/mediator'
import { resolveCommand, resolveMany } from '@mcro/mediator'
import {
  AppModel,
  BitModel,
  CosalTopWordsCommand,
  GithubRepositoryModel,
  GithubSourceBlacklistCommand,
  JobModel,
  PersonBitModel,
  PersonModel,
  SalientWordsModel,
  SearchByTopicModel,
  SearchLocationsModel,
  SearchPinnedResultModel,
  SearchResultModel,
  SettingModel,
  SlackChannelModel,
  SlackSourceBlacklistCommand,
  SourceModel,
  SourceRemoveCommand,
  SourceSaveCommand,
  SpaceModel,
  TrendingTopicsModel,
  TrendingTermsModel,
  PeopleNearTopicModel,
  BitsNearTopicModel,
  CosalTopicsModel,
  CheckProxyCommand,
} from '@mcro/models'
import { SetupProxyCommand } from '@mcro/models'
import { Screen } from '@mcro/screen'
import { App, Desktop, Electron } from '@mcro/stores'
import { writeJSON } from 'fs-extra'
import root from 'global'
import macosVersion from 'macos-version'
import open from 'opn'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { getConnection } from 'typeorm'
import { COSAL_DB, screenOptions } from './constants'
import { AppsManager } from './managers/appsManager'
import { ContextManager } from './managers/ContextManager'
import { CosalManager } from './managers/CosalManager'
import { DatabaseManager } from './managers/DatabaseManager'
import { GeneralSettingManager } from './managers/GeneralSettingManager'
import { AuthServer } from './auth-server/AuthServer'
import { KeyboardManager } from './managers/KeyboardManager'
import { MousePositionManager } from './managers/MousePositionManager'
import { OCRManager } from './managers/OCRManager'
import { OnboardManager } from './managers/OnboardManager'
import { ScreenManager } from './managers/ScreenManager'
import { getCosalResolvers } from './resolvers/getCosalResolvers'
import { GithubRepositoryManyResolver } from './resolvers/GithubRepositoryResolver'
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SearchLocationsResolver } from './resolvers/SearchLocationsResolver'
import { SearchPinnedResolver } from './resolvers/SearchPinnedResolver'
import { SearchResultResolver } from './resolvers/SearchResultResolver'
import { getSearchByTopicResolver } from './resolvers/SearcyByTopicResolver'
import { SlackChannelManyResolver } from './resolvers/SlackChannelResolver'
import { SourceRemoveResolver } from './resolvers/SourceRemoveResolver'
import { SourceSaveResolver } from './resolvers/SourceSaveResolver'
import { WebServer } from './WebServer'
import { getBitNearTopicsResolver } from './resolvers/BitNearTopicResolver'
import { getPeopleNearTopicsResolver } from './resolvers/PeopleNearTopicResolver'
import { checkAuthProxy } from './auth-server/checkAuthProxy'
import { startAuthProxy } from './auth-server/startAuthProxy'
import { Oracle } from '@mcro/oracle'
import { OracleManager } from './managers/OracleManager'

export class Root {
  // public
  stores = null

  private config = getGlobalConfig()
  private screen: Screen
  private oracle: Oracle
  private authServer: AuthServer
  private onboardManager: OnboardManager
  private disposed = false
  private webServer: WebServer
  private mediatorServer: MediatorServer
  private cosal = new Cosal({
    database: COSAL_DB,
  })

  // managers
  private oracleManager: OracleManager
  private cosalManager: CosalManager
  private ocrManager: OCRManager
  private appsManager: AppsManager
  private screenManager: ScreenManager
  private generalSettingManager: GeneralSettingManager
  private databaseManager: DatabaseManager
  private keyboardManager: KeyboardManager

  start = async () => {
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

    this.registerMediatorServer()

    this.generalSettingManager = new GeneralSettingManager()
    await this.generalSettingManager.start()

    // start server a bit early so other apps can start
    this.webServer = new WebServer()
    await this.webServer.start()

    this.authServer = new AuthServer()
    await this.authServer.start()

    this.onboardManager = new OnboardManager()
    await this.onboardManager.start()

    // start cosal before we pass into managers...
    await this.cosal.start()

    // setup screen before we pass into managers...
    this.screen = new Screen({
      ...screenOptions,
      showTray: true,
    })
    this.oracle = new Oracle()

    this.screen.onError(err => {
      if (err.indexOf('Could not watch application') >= 0) {
        return
      }
      console.log('Screen error', err)
    })

    // start managers...

    this.oracleManager = new OracleManager({ oracle: this.oracle })
    await this.oracleManager.start()

    this.ocrManager = new OCRManager({ cosal: this.cosal })
    this.cosalManager = new CosalManager({ cosal: this.cosal })
    this.screenManager = new ScreenManager({ screen: this.screen })
    this.keyboardManager = new KeyboardManager({ screen: this.screen })
    this.appsManager = new AppsManager()

    new ContextManager({ screen: this.screen })
    new MousePositionManager({
      screen: this.screen,
      onMouseMove: this.keyboardManager.onMouseMove,
    })

    // start screen after passing into screenManager
    await this.screen.start()
    // then start screenmanager after screen.start
    // no need to await
    this.screenManager.start()
    // start screen related managers once its started
    // no need to await
    this.ocrManager.start()

    // scanning cosal is high cpu load, we need better solution for high cpu on this process
    // until then lets just wait a bit
    setTimeout(() => {
      this.cosalManager.updateSearchIndexWithNewBits()
      this.cosalManager.scanTopics()
    }, 1000 * 6)

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
    await writeJSON(this.config.paths.orbitConfig, this.config)
    Desktop.dispose()
    if (this.appsManager) {
      await this.appsManager.dispose()
    }
    await this.ocrManager.dispose()
    if (this.authServer.isRunning()) {
      await this.authServer.stop()
    }
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
        AppModel,
        SourceModel,
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
        SpaceModel,
        TrendingTopicsModel,
        TrendingTermsModel,
        PeopleNearTopicModel,
        BitsNearTopicModel,
        CosalTopicsModel,
      ],
      commands: [
        SourceSaveCommand,
        SourceRemoveCommand,
        GithubSourceBlacklistCommand,
        SlackSourceBlacklistCommand,
        CosalTopWordsCommand,
        SetupProxyCommand,
      ],
      transport: new WebSocketServerTransport({
        port: this.config.ports.dbBridge,
      }),
      resolvers: [
        // @ts-ignore
        ...typeormResolvers(getConnection(), [
          { entity: AppEntity, models: [AppModel] },
          { entity: SourceEntity, models: [SourceModel] },
          { entity: SettingEntity, models: [SettingModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: JobEntity, models: [JobModel] },
          { entity: PersonEntity, models: [PersonModel] },
          { entity: PersonBitEntity, models: [PersonBitModel] },
          { entity: SpaceEntity, models: [SpaceModel] },
        ]),
        SourceRemoveResolver,
        SourceSaveResolver,
        GithubRepositoryManyResolver,
        SlackChannelManyResolver,
        ...getCosalResolvers(this.cosal),
        getSearchByTopicResolver(this.cosal),
        getBitNearTopicsResolver(this.cosal),
        getPeopleNearTopicsResolver(this.cosal),
        resolveMany(SearchResultModel, async args => {
          return new SearchResultResolver(this.cosal, args).resolve()
        }),
        getSalientWordsResolver(this.cosal),
        SearchLocationsResolver,
        SearchPinnedResolver,
        resolveCommand(CheckProxyCommand, checkAuthProxy),
        resolveCommand(SetupProxyCommand, async () => {
          if (await checkAuthProxy()) {
            return true
          } else {
            return await startAuthProxy()
          }
        }),
      ],
    })
    this.mediatorServer.bootstrap()
  }
}
