import { getGlobalConfig } from '@o/config'
import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import {
  MediatorClient,
  MediatorServer,
  resolveCommand,
  resolveMany,
  typeormResolvers,
  WebSocketClientTransport,
  WebSocketServerTransport,
} from '@o/mediator'
import {
  AppEntity,
  AppModel,
  AppRemoveCommand,
  BitEntity,
  BitModel,
  BitsNearTopicModel,
  CallAppBitApiMethodCommand,
  ChangeDesktopThemeCommand,
  CheckProxyCommand,
  CosalSaliencyModel,
  CosalTopicsModel,
  CosalTopWordsModel,
  NewFallbackServerPortCommand,
  OpenCommand,
  PeopleNearTopicModel,
  ResetDataCommand,
  SalientWordsModel,
  SearchByTopicModel,
  SearchLocationsModel,
  SearchPinnedResultModel,
  SearchResultModel,
  SendClientDataCommand,
  SetupProxyCommand,
  SpaceEntity,
  SpaceModel,
  TrendingTermsModel,
  TrendingTopicsModel,
  UserEntity,
  UserModel,
  AppDevCloseCommand,
  AppDevOpenCommand,
  CloseAppCommand,
} from '@o/models'
import { Screen } from '@o/screen'
import { App, Desktop, Electron } from '@o/stores'
import bonjour from 'bonjour'
import { writeJSON } from 'fs-extra'
import root from 'global'
import open from 'opn'
import * as Path from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
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
import { AppRemoveResolver } from './resolvers/AppRemoveResolver'
import { getBitNearTopicsResolver } from './resolvers/BitNearTopicResolver'
import { CallAppBitApiMethodResolver } from './resolvers/CallAppBitApiMethodResolver'
import { ChangeDesktopThemeResolver } from './resolvers/ChangeDesktopThemeResolver'
import { getCosalResolvers } from './resolvers/getCosalResolvers'
import { NewFallbackServerPortResolver } from './resolvers/NewFallbackServerPortResolver'
import { getPeopleNearTopicsResolver } from './resolvers/PeopleNearTopicResolver'
import { ResetDataResolver } from './resolvers/ResetDataResolver'
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SearchLocationsResolver } from './resolvers/SearchLocationsResolver'
import { SearchPinnedResolver } from './resolvers/SearchPinnedResolver'
import { SearchResultResolver } from './resolvers/SearchResultResolver'
import { SendClientDataResolver } from './resolvers/SendClientDataResolver'
import { WebServer } from './WebServer'
import { GraphServer } from './GraphServer'
import { OrbitAppsManager } from './managers/OrbitAppsManager'
import { BuildServer } from '@o/build-server'
import { remove } from 'lodash'

const log = new Logger('desktop')

export class OrbitDesktopRoot {
  // public
  stores = null
  databaseManager: DatabaseManager
  mediatorServer: MediatorServer

  private config = getGlobalConfig()
  private screen: Screen
  private authServer: AuthServer
  private graphServer: GraphServer
  private onboardManager: OnboardManager
  private disposed = false
  private webServer: WebServer
  private cosal: Cosal
  private bonjour: bonjour.Bonjour
  private bonjourService: bonjour.Service
  private buildServer: BuildServer

  // managers
  private orbitDataManager: OrbitDataManager
  private oracleManager: OracleManager
  private cosalManager: CosalManager
  // private ocrManager: OCRManager
  // private screenManager: ScreenManager
  private generalSettingManager: GeneralSettingManager
  private keyboardManager: KeyboardManager
  private topicsManager: TopicsManager
  private operatingSystemManager: OperatingSystemManager
  private orbitAppsManager: OrbitAppsManager

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

    this.cosalManager = new CosalManager({ dbPath: COSAL_DB })
    await this.cosalManager.start()

    // mediator server before starting webserver, because electron needs mediator up
    // so it can send commands as it starts up back to here, see NewFallbackServerPortCommand
    this.cosal = this.cosalManager.cosal
    // depends on cosal
    this.registerMediatorServer()

    this.buildServer = new BuildServer()

    // the electron app wont start until this runs
    // start server a bit early so it lets them start
    this.webServer = new WebServer(this.buildServer)
    await this.webServer.start()

    this.authServer = new AuthServer()
    this.graphServer = new GraphServer()

    await Promise.all([this.authServer.start(), this.graphServer.start()])

    // depends on cosal
    this.topicsManager = new TopicsManager({ cosal: this.cosal })
    await this.topicsManager.start()

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

    if (!process.env.DISABLE_MENU) {
      this.oracleManager = new OracleManager()
      await this.oracleManager.start()
    }

    // this.ocrManager = new OCRManager({ cosal: this.cosal })
    // this.screenManager = new ScreenManager({ screen: this.screen })
    this.keyboardManager = new KeyboardManager({ screen: this.screen })
    this.orbitDataManager = new OrbitDataManager()
    await this.orbitDataManager.start()

    this.orbitAppsManager = new OrbitAppsManager()
    await this.orbitAppsManager.start()

    new ContextManager({ screen: this.screen })
    new MousePositionManager({
      screen: this.screen,
      onMouseMove: this.keyboardManager.onMouseMove,
    })

    this.registerREPLGlobals()

    console.log('DESKTOP FINISHED START()')
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
    console.log('dispose desktop...')
    Desktop.dispose()
    // await this.ocrManager.dispose()
    if (this.authServer && this.authServer.isRunning()) {
      console.log('stop auth server...')
      await this.authServer.stop()
    }
    if (this.bonjourService) {
      this.bonjourService.stop(() => {})
      this.bonjourService = null
    }
    if (this.bonjour) {
      this.bonjour.destroy()
      this.bonjour = null
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
    const syncersTransport = new WebSocketClientTransport(
      'syncers',
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.syncersMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    )

    const client = new MediatorClient({ transports: [syncersTransport] })

    const mediatorServerPort = this.config.ports.desktopMediator
    let developingApps: { path: string; publicPath: string; appId: number }[] = []

    this.mediatorServer = new MediatorServer({
      models: [
        AppModel,
        BitModel,
        UserModel,
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
        NewFallbackServerPortCommand,
        CallAppBitApiMethodCommand,
        AppRemoveCommand,
        SetupProxyCommand,
        CheckProxyCommand,
        OpenCommand,
        ResetDataCommand,
        SendClientDataCommand,
        ChangeDesktopThemeCommand,
        AppDevOpenCommand,
        AppDevCloseCommand,
      ],
      transport: new WebSocketServerTransport({
        port: mediatorServerPort,
      }),
      fallbackClient: client,
      resolvers: [
        ...typeormResolvers(getConnection(), [
          { entity: AppEntity, models: [AppModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: SpaceEntity, models: [SpaceModel] },
          { entity: UserEntity, models: [UserModel] },
        ]),
        resolveCommand(AppDevOpenCommand, async ({ path }) => {
          const appId = Object.keys(Electron.state.appWindows).length
          developingApps.push({
            appId,
            path,
            publicPath: `/appServer/${appId}`,
          })
          this.buildServer.setApps(developingApps)
          return appId
        }),
        resolveCommand(AppDevCloseCommand, async ({ appId }) => {
          log.info('Removing build server', appId)
          developingApps = remove(developingApps, x => x.appId === appId)
          this.buildServer.setApps(developingApps)
          log.info('Removing process', appId)
          await this.mediatorServer.sendRemoteCommand(CloseAppCommand, { appId })
          log.info('Closed app', appId)
        }),
        AppRemoveResolver,
        NewFallbackServerPortResolver,
        CallAppBitApiMethodResolver,
        ...getCosalResolvers(this.cosal),
        getBitNearTopicsResolver(this.cosal),
        getPeopleNearTopicsResolver(this.cosal),
        resolveMany(SearchResultModel, async args => {
          return await new SearchResultResolver(this.cosal, args).resolve()
        }),
        getSalientWordsResolver(this.cosal),
        SearchLocationsResolver,
        SearchPinnedResolver,
        ResetDataResolver,
        SendClientDataResolver,
        ChangeDesktopThemeResolver,
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
    log.info(`mediatorServer starts listening at ${mediatorServerPort}`)

    // start announcing on bonjour
    this.bonjour = bonjour()
    this.bonjourService = this.bonjour.publish({
      name: 'orbitDesktop',
      type: 'orbitDesktop',
      port: mediatorServerPort,
    })
    this.bonjourService.start()
  }
}
