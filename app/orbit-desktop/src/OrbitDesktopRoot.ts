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
  resolveObserveOne,
} from '@o/mediator'
import {
  AppEntity,
  AppModel,
  BitEntity,
  BitModel,
  CheckProxyCommand,
  CosalSaliencyModel,
  CosalTopicsModel,
  GetPIDCommand,
  CosalTopWordsModel,
  OpenCommand,
  SalientWordsModel,
  SearchByTopicModel,
  SearchLocationsModel,
  SearchResultModel,
  SetupProxyCommand,
  SpaceEntity,
  SpaceModel,
  UserEntity,
  UserModel,
  AppDevCloseCommand,
  AppDevOpenCommand,
  CloseAppCommand,
  AppMetaCommand,
  AuthAppCommand,
  AppGetWorkspaceAppsCommand,
  StateModel,
  StateEntity,
  RemoveAllAppDataCommand,
  AppStatusModel,
  ResetDataCommand,
} from '@o/models'
import { OrbitAppsManager } from '@o/libs-node'
import { App, Desktop, Electron } from '@o/stores'
import bonjour from 'bonjour'
import { writeJSONSync } from 'fs-extra'
import root from 'global'
import open from 'open'
import * as Path from 'path'
import ReconnectingWebSocket from 'reconnecting-websocket'
import * as typeorm from 'typeorm'
import { getConnection } from 'typeorm'
import { AuthServer } from './auth-server/AuthServer'
import { checkAuthProxy } from './auth-server/checkAuthProxy'
import { startAuthProxy } from './auth-server/startAuthProxy'
import { COSAL_DB } from './constants'
import { CosalManager } from './managers/CosalManager'
import { DatabaseManager } from './managers/DatabaseManager'
import { GeneralSettingManager } from './managers/GeneralSettingManager'
// import { Screen } from '@o/screen'
// import { OCRManager } from './managers/OCRManager'
// import { ScreenManager } from './managers/ScreenManager'
import { OnboardManager } from './managers/OnboardManager'
import { OperatingSystemManager } from './managers/OperatingSystemManager'
import { OrbitDataManager } from './managers/OrbitDataManager'
import { TopicsManager } from './managers/TopicsManager'
import { AppRemoveResolver } from './resolvers/AppRemoveResolver'
import { createCallAppBitApiMethodResolver } from './resolvers/CallAppBitApiMethodResolver'
import { ChangeDesktopThemeResolver } from './resolvers/ChangeDesktopThemeResolver'
import { getCosalResolvers } from './resolvers/getCosalResolvers'
import { NewFallbackServerPortResolver } from './resolvers/NewFallbackServerPortResolver'
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SearchResultResolver } from './resolvers/SearchResultResolver'
import { SendClientDataResolver } from './resolvers/SendClientDataResolver'
import { WebServer } from './WebServer'
import { GraphServer } from './GraphServer'
import { AppMiddleware, AppDesc } from '@o/build-server'
import { remove } from 'lodash'
import { loadAppDefinitionResolvers } from './resolvers/loadAppDefinitionResolvers'
import { FinishAuthQueue } from './auth-server/finishAuth'
import { createAppOpenWorkspaceResolver } from './resolvers/AppOpenWorkspaceResolver'
import { AppCreateWorkspaceResolver } from './resolvers/AppCreateWorkspaceResolver'
import { createAppCreateNewResolver } from './resolvers/AppCreateNewResolver'
import { appStatusManager } from './managers/AppStatusManager'
import { getIdentifierToPackageId, WorkspaceManager } from '@o/cli'
import { CLI } from './cli'

const log = new Logger('desktop')

export class OrbitDesktopRoot {
  // public
  stores = null
  databaseManager: DatabaseManager
  mediatorServer: MediatorServer

  config = getGlobalConfig()
  authServer: AuthServer
  graphServer: GraphServer
  onboardManager: OnboardManager
  disposed = false
  webServer: WebServer
  bonjour: bonjour.Bonjour
  bonjourService: bonjour.Service
  appMiddleware: AppMiddleware
  cli: CLI

  // managers
  orbitDataManager: OrbitDataManager
  cosalManager: CosalManager
  generalSettingManager: GeneralSettingManager
  topicsManager: TopicsManager
  operatingSystemManager: OperatingSystemManager
  orbitAppsManager: OrbitAppsManager
  workspaceManager: WorkspaceManager | null = null

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

    // TODO: this abritrary ordering here is really a dependency graph, should be setup in that way

    // FIRST THING
    // databaserunner runs your migrations which everything can be impacted by...
    // leave it as high up here as possible
    this.databaseManager = new DatabaseManager()
    await this.databaseManager.start()

    // run this early, it sets up the general setting if needed
    this.generalSettingManager = new GeneralSettingManager()

    // manages operating system state
    this.operatingSystemManager = new OperatingSystemManager()

    // search index
    this.cosalManager = new CosalManager({ dbPath: COSAL_DB })
    await this.cosalManager.start()

    // manage apps/apis
    this.orbitAppsManager = new OrbitAppsManager()

    await Promise.all([this.generalSettingManager.start(), this.operatingSystemManager.start()])

    // signals to frontend to update app definitions
    this.orbitAppsManager.onUpdatedAppMeta(appMeta => {
      log.info('orbitAppsManager updating app meta', appMeta)
      const identifiers = Object.keys(appMeta)
      const packageIds = identifiers.map(getIdentifierToPackageId)
      Desktop.setState({
        workspaceState: {
          packageIds,
          identifiers,
        },
      })
    })

    this.appMiddleware = new AppMiddleware()

    this.appMiddleware.onStatus(status => {
      appStatusManager.sendMessage(status)
    })

    const cosal = this.cosalManager.cosal

    // pass dependencies into here as arguments to be clear
    const mediatorPort = this.registerMediatorServer({
      appMiddleware: this.appMiddleware,
      cosal,
      orbitAppsManager: this.orbitAppsManager,
    })

    // depends on middleware + mediatorServer
    this.cli = new CLI(this.appMiddleware, this.mediatorServer, this.orbitAppsManager)

    // start announcing on bonjour
    this.bonjour = bonjour()
    this.bonjourService = this.bonjour.publish({
      name: 'orbitDesktop',
      type: 'orbitDesktop',
      port: mediatorPort,
    })
    this.bonjourService.start()

    // the electron app wont start until this runs
    // start server a bit early so it lets them start
    this.webServer = new WebServer(this.appMiddleware)
    await this.webServer.start()

    this.authServer = new AuthServer()
    this.graphServer = new GraphServer()

    await Promise.all([this.authServer.start()])

    // depends on cosal
    this.topicsManager = new TopicsManager({ cosal })
    await this.topicsManager.start()

    this.onboardManager = new OnboardManager()
    await this.onboardManager.start()

    this.orbitDataManager = new OrbitDataManager()
    await this.orbitDataManager.start()

    this.registerREPLGlobals()

    console.log('DESKTOP FINISHED START()')
  }

  restart = () => {
    require('touch')(Path.join(__dirname, '..', '_', 'main.js'))
  }

  dispose = async () => {
    log.info('Disposing Desktop.Root')
    if (this.disposed) {
      return
    }
    log.info('dispose desktop...')
    Desktop.dispose()
    // await this.ocrManager.dispose()
    if (this.authServer && this.authServer.isRunning()) {
      log.info('stop auth server...')
      await this.authServer.stop()
    }
    log.info('writing orbit config...', this.config.paths.orbitConfig)
    writeJSONSync(this.config.paths.orbitConfig, this.config)
    log.info('Stop bonjour')
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

  setWorkspaceManager(wsManager: WorkspaceManager) {
    log.info(`setWorkspaceManager`)
    this.workspaceManager = wsManager
    // start orbit apps manager workspace manager is started
    // this is some sloppy code, needs refactoring.
    // we start it after because workspace manager validated/updated a few things in SpaceEntity
    // like being sure directory is matching
    this.orbitAppsManager.start()
    // same goes for graphManager
    this.graphServer.start()
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private registerMediatorServer(props: {
    cosal: Cosal
    orbitAppsManager: OrbitAppsManager
    appMiddleware: AppMiddleware
  }) {
    const syncersTransport = new WebSocketClientTransport(
      'syncers',
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.syncersMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    )

    const client = new MediatorClient({ transports: [syncersTransport] })

    const mediatorServerPort = this.config.ports.desktopMediator

    this.mediatorServer = new MediatorServer({
      models: [
        AppModel,
        BitModel,
        UserModel,
        SearchResultModel,
        SalientWordsModel,
        SearchLocationsModel,
        SearchByTopicModel,
        SpaceModel,
        StateModel,
        CosalTopicsModel,
        CosalSaliencyModel,
        CosalTopWordsModel,
        AppStatusModel,
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
          { entity: StateEntity, models: [StateModel] },
        ]),
        resolveObserveOne(AppStatusModel, args => {
          return appStatusManager.observe(args.appId)
        }),
        ...loadAppDefinitionResolvers(),
        ...this.cli.getResolvers(),
        resolveCommand(AppMetaCommand, async ({ identifier }) => {
          return this.orbitAppsManager.appMeta[identifier] || null
        }),
        resolveCommand(GetPIDCommand, async () => {
          return process.pid
        }),
        resolveCommand(RemoveAllAppDataCommand, async () => {
          log.info('Remove all app data!')
          const connection = typeorm.getConnection()
          await Promise.all([
            connection.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`),
            connection.query(`DROP TABLE IF EXISTS 'job_entity'`),
            connection.query(`DROP TABLE IF EXISTS 'bit_entity'`),
            connection.query(`DROP TABLE IF EXISTS 'app_entity_spaces_space_entity'`),
            connection.query(`DROP TABLE IF EXISTS 'app_entity'`),
          ])
          log.info('Remove all app data done')
        }),
        createAppOpenWorkspaceResolver(this),
        createAppCreateNewResolver(this),
        AppCreateWorkspaceResolver,
        AppRemoveResolver,
        NewFallbackServerPortResolver,
        createCallAppBitApiMethodResolver(props.orbitAppsManager),
        ...getCosalResolvers(props.cosal),
        resolveMany(SearchResultModel, async args => {
          return await new SearchResultResolver(props.cosal, args).resolve()
        }),
        getSalientWordsResolver(props.cosal),
        resolveCommand(ResetDataCommand, async () => {
          log.info(`resetting data...`)
          await this.databaseManager.resetAllData()
        }),
        SendClientDataResolver,
        ChangeDesktopThemeResolver,
        resolveCommand(CheckProxyCommand, checkAuthProxy),
        resolveCommand(AuthAppCommand, async ({ authKey, identifier }) => {
          const success = (await checkAuthProxy()) || (await startAuthProxy())

          if (!success) {
            return {
              type: 'error' as const,
              message: `Error setting up local authentication proxy.`,
            }
          }

          const url = `${getGlobalConfig().urls.auth}/auth/${authKey}`
          const didOpenAuthUrl = await openUrl({ url })

          if (!didOpenAuthUrl) {
            return {
              type: 'error' as const,
              message: `Couldn't open the authentication url: ${url}`,
            }
          }

          // wait for finish from finishAuth()
          let finish
          const promise = new Promise(res => {
            finish = res
          })

          FinishAuthQueue.set(authKey, { identifier, finish })

          return await promise
        }),

        resolveCommand(AppGetWorkspaceAppsCommand, async () => {
          if (this.workspaceManager) {
            return this.workspaceManager.apps
          }
          return []
        }),

        resolveCommand(SetupProxyCommand, async () => {
          const success = (await checkAuthProxy()) || (await startAuthProxy())
          console.log('finishing setup proxy', success)
          return success
        }),

        resolveCommand(OpenCommand, openUrl),
      ],
    })

    this.mediatorServer.bootstrap()

    // TODO see NewFallbackServerPortResolver
    root.mediatorServer = this.mediatorServer

    log.info(`mediatorServer listening at ${mediatorServerPort}`)

    return mediatorServerPort
  }
}

async function openUrl({ url }: { url: string }) {
  try {
    open(url)
    return true
  } catch (err) {
    console.log('error opening', err)
    return false
  }
}
