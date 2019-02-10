import { debugState } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { Cosal } from '@mcro/cosal'
import { Logger } from '@mcro/logger'
import {
  MediatorServer,
  resolveCommand,
  resolveMany,
  typeormResolvers,
  WebSocketServerTransport,
} from '@mcro/mediator'
import {
  AppEntity,
  AppModel,
  BitEntity,
  BitModel,
  BitsNearTopicModel,
  CheckProxyCommand,
  CosalSaliencyModel,
  CosalTopicsModel,
  CosalTopWordsModel,
  GithubRepositoryModel,
  GithubSourceBlacklistCommand,
  JobEntity,
  JobModel,
  OpenCommand,
  PeopleNearTopicModel,
  PersonBitEntity,
  PersonBitModel,
  PersonEntity,
  PersonModel,
  SalientWordsModel,
  SearchByTopicModel,
  SearchLocationsModel,
  SearchPinnedResultModel,
  SearchResultModel,
  SettingEntity,
  SettingModel,
  SetupProxyCommand,
  SlackChannelModel,
  SlackSourceBlacklistCommand,
  SourceEntity,
  SourceModel,
  SourceRemoveCommand,
  SourceSaveCommand,
  SpaceEntity,
  SpaceModel,
  TrendingTermsModel,
  TrendingTopicsModel,
  UserEntity,
  UserModel,
} from '@mcro/models'
import { Screen } from '@mcro/screen'
import { App, Desktop, Electron } from '@mcro/stores'
import { writeJSON } from 'fs-extra'
import root from 'global'
import open from 'opn'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { getConnection } from 'typeorm'
import { AuthServer } from './auth-server/AuthServer'
import { checkAuthProxy } from './auth-server/checkAuthProxy'
import { startAuthProxy } from './auth-server/startAuthProxy'
import { COSAL_DB, screenOptions } from './constants'
import { ContextManager } from './managers/ContextManager'
import { CosalManager } from './managers/CosalManager'
import { DatabaseManager } from './managers/DatabaseManager'
import { GeneralSettingManager } from './managers/GeneralSettingManager'
import { KeyboardManager } from './managers/KeyboardManager'
import { MousePositionManager } from './managers/MousePositionManager'
// import { OCRManager } from './managers/OCRManager'
import { OnboardManager } from './managers/OnboardManager'
import { OperatingSystemManager } from './managers/OperatingSystemManager'
import { OracleManager } from './managers/OracleManager'
import { OrbitDataManager } from './managers/OrbitDataManager'
// import { ScreenManager } from './managers/ScreenManager'
import { TopicsManager } from './managers/TopicsManager'
import { getBitNearTopicsResolver } from './resolvers/BitNearTopicResolver'
import { getCosalResolvers } from './resolvers/getCosalResolvers'
import { GithubRepositoryManyResolver } from './resolvers/GithubRepositoryResolver'
import { getPeopleNearTopicsResolver } from './resolvers/PeopleNearTopicResolver'
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SearchLocationsResolver } from './resolvers/SearchLocationsResolver'
import { SearchPinnedResolver } from './resolvers/SearchPinnedResolver'
import { SearchResultResolver } from './resolvers/SearchResultResolver'
import { SlackChannelManyResolver } from './resolvers/SlackChannelResolver'
import { SourceRemoveResolver } from './resolvers/SourceRemoveResolver'
import { SourceSaveResolver } from './resolvers/SourceSaveResolver'
import { WebServer } from './WebServer'

export class OrbitDesktopRoot {
  // public
  stores = null

  private config = getGlobalConfig()
  private screen: Screen
  private authServer: AuthServer
  private onboardManager: OnboardManager
  private disposed = false
  private webServer: WebServer
  private mediatorServer: MediatorServer
  private cosal: Cosal

  // managers
  private orbitDataManager: OrbitDataManager
  private oracleManager: OracleManager
  private cosalManager: CosalManager
  // private ocrManager: OCRManager
  // private screenManager: ScreenManager
  private generalSettingManager: GeneralSettingManager
  private databaseManager: DatabaseManager
  private keyboardManager: KeyboardManager
  private topicsManager: TopicsManager
  private operatingSystemManager: OperatingSystemManager

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

    // FIRST THING
    // databaserunner runs your migrations which everything can be impacted by...
    // leave it as high up here as possible
    this.databaseManager = new DatabaseManager()
    await this.databaseManager.start()

    // run this early, it sets up the general setting if needed
    // TODO: this abritrary ordering of these things is really a dependency graph, could be setup that way
    this.generalSettingManager = new GeneralSettingManager()
    await this.generalSettingManager.start()

    // manages operating system state
    this.operatingSystemManager = new OperatingSystemManager()
    this.operatingSystemManager.start()

    // cosal is a dependency of many things
    this.cosalManager = new CosalManager({ dbPath: COSAL_DB })
    await this.cosalManager.start()
    this.cosal = this.cosalManager.cosal

    // depends on cosal and generalSetting
    this.topicsManager = new TopicsManager({ cosal: this.cosal })
    await this.topicsManager.start()

    // the electron app wont start until this runs
    // start server a bit early so it lets them start
    this.webServer = new WebServer()
    await this.webServer.start()

    this.authServer = new AuthServer()
    await this.authServer.start()

    this.onboardManager = new OnboardManager()
    await this.onboardManager.start()

    // setup screen before we pass into managers...
    this.screen = new Screen({
      ...screenOptions,
      showTray: true,
    })

    this.screen.onError(err => {
      if (err.indexOf('Could not watch application') >= 0) {
        return
      }
      console.log('Screen error', err)
    })

    // start managers...

    if (!process.env.IGNORE_MENU) {
      this.oracleManager = new OracleManager()
      await this.oracleManager.start()
    }

    // this.ocrManager = new OCRManager({ cosal: this.cosal })
    // this.screenManager = new ScreenManager({ screen: this.screen })
    this.keyboardManager = new KeyboardManager({ screen: this.screen })
    this.orbitDataManager = new OrbitDataManager()
    await this.orbitDataManager.start()

    new ContextManager({ screen: this.screen })
    new MousePositionManager({
      screen: this.screen,
      onMouseMove: this.keyboardManager.onMouseMove,
    })

    // depends on cosal
    this.registerMediatorServer()

    // try {
    //   // start screen after passing into screenManager
    //   // await this.screen.start()

    //   // after screen.start:

    //   // then start screenmanager
    //   // await this.screenManager.start()
    //   // start screen related managers
    //   await this.ocrManager.start()
    // } catch (err) {
    //   console.error('Error starting a manager', err)
    // }

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
    // await this.ocrManager.dispose()
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
        UserModel,
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
        CosalSaliencyModel,
        CosalTopWordsModel,
      ],
      commands: [
        SourceSaveCommand,
        SourceRemoveCommand,
        GithubSourceBlacklistCommand,
        SlackSourceBlacklistCommand,
        SetupProxyCommand,
        CheckProxyCommand,
        OpenCommand,
      ],
      transport: new WebSocketServerTransport({
        port: this.config.ports.desktopMediator,
      }),
      resolvers: [
        ...typeormResolvers(getConnection(), [
          { entity: AppEntity, models: [AppModel] },
          { entity: SourceEntity, models: [SourceModel] },
          { entity: SettingEntity, models: [SettingModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: JobEntity, models: [JobModel] },
          { entity: PersonEntity, models: [PersonModel] },
          { entity: PersonBitEntity, models: [PersonBitModel] },
          { entity: SpaceEntity, models: [SpaceModel] },
          { entity: UserEntity, models: [UserModel] },
        ]),
        SourceRemoveResolver,
        SourceSaveResolver,
        GithubRepositoryManyResolver,
        SlackChannelManyResolver,
        ...getCosalResolvers(this.cosal),
        getBitNearTopicsResolver(this.cosal),
        getPeopleNearTopicsResolver(this.cosal),
        resolveMany(SearchResultModel, async args => {
          return await new SearchResultResolver(this.cosal, args).resolve()
        }),
        getSalientWordsResolver(this.cosal),
        SearchLocationsResolver,
        SearchPinnedResolver,
        resolveCommand(CheckProxyCommand, checkAuthProxy),
        resolveCommand(SetupProxyCommand, async () => {
          const success = (await checkAuthProxy()) || (await startAuthProxy())
          console.log('finishing setup proxy', success)
          return success
        }),
        resolveCommand(OpenCommand, async ({ url }) => {
          try {
            open(url)
            return true
          } catch (err) {
            console.log('error opening', err)
            return false
          }
        }),
      ],
    })
    this.mediatorServer.bootstrap()
  }
}
