import { getGlobalConfig } from '@o/config'
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
  AuthAppCommand,
  StateModel,
  StateEntity,
  RemoveAllAppDataCommand,
  AppStatusModel,
  ResetDataCommand,
} from '@o/models'
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
import { OnboardManager } from './managers/OnboardManager'
import { OperatingSystemManager } from './managers/OperatingSystemManager'
import { OrbitDataManager } from './managers/OrbitDataManager'
import { TopicsManager } from './managers/TopicsManager'
import { AppRemoveResolver } from './resolvers/AppRemoveResolver'
import { ChangeDesktopThemeResolver } from './resolvers/ChangeDesktopThemeResolver'
import { getCosalResolvers } from './resolvers/getCosalResolvers'
import { NewFallbackServerPortResolver } from './resolvers/NewFallbackServerPortResolver'
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SearchResultResolver } from './resolvers/SearchResultResolver'
import { SendClientDataResolver } from './resolvers/SendClientDataResolver'
import { WebServer } from './WebServer'
import { GraphServer } from './GraphServer'
import { loadAppDefinitionResolvers } from './resolvers/loadAppDefinitionResolvers'
import { FinishAuthQueue } from './auth-server/finishAuth'
import { createAppCreateNewResolver } from './resolvers/AppCreateNewResolver'
import { WorkspaceManager } from './WorkspaceManager/WorkspaceManager'
import { orTimeout, OR_TIMED_OUT } from '@o/ui'

const log = new Logger('OrbitDesktopRoot')

async function startSeries(
  fns: (() => Promise<void>)[],
  options: {
    timeout?: number
  } = {},
) {
  for (const fn of fns) {
    log.verbose('startSeries, start function', fn, options.timeout)
    if (options.timeout) {
      try {
        await orTimeout(fn(), options.timeout)
      } catch (err) {
        if (err === OR_TIMED_OUT) {
          console.log('Timed out starting', fn)
        }
        throw err
      }
    } else {
      await fn()
    }
  }
}

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

  // managers
  workspaceManager: WorkspaceManager
  orbitDataManager: OrbitDataManager
  cosalManager: CosalManager
  generalSettingManager: GeneralSettingManager
  topicsManager: TopicsManager
  operatingSystemManager: OperatingSystemManager

  start = async () => {
    // this is if we are running a CLI command that exits on finish
    const singleUseMode = !!process.env.SINGLE_USE_MODE
    log.verbose(`start(), singleUseMode ${singleUseMode}`)

    await startSeries(
      [
        async () => {
          if (!singleUseMode) {
            await Desktop.start({
              ignoreSelf: true,
              master: true,
              stores: {
                App,
                Electron,
                Desktop,
              },
            })
          }
        },
        async () => {
          // databaserunner runs your migrations which everything can be impacted by...
          // leave it as high up here as possible
          this.databaseManager = new DatabaseManager()
          await this.databaseManager.start()
        },
        async () => {
          this.workspaceManager = new WorkspaceManager(this.mediatorServer)
          try {
            await this.workspaceManager.start({
              singleUseMode,
            })
          } catch (err) {
            console.error('error starting', err)
            throw err
          }
        },
        async () => {
          if (!singleUseMode) {
            // run this early, it sets up the general setting if needed
            this.generalSettingManager = new GeneralSettingManager()
          }
        },
        async () => {
          if (!singleUseMode) {
            // manages operating system state
            this.operatingSystemManager = new OperatingSystemManager()
          }
        },
        async () => {
          if (!singleUseMode) {
            // search index
            this.cosalManager = new CosalManager({ dbPath: COSAL_DB })
            await this.cosalManager.start()
          }
        },
        async () => {
          if (!singleUseMode) {
            await Promise.all([
              this.generalSettingManager.start(),
              this.operatingSystemManager.start(),
            ])
          }
        },
        async () => {
          if (!singleUseMode) {
            // the electron app wont start until this runs
            // start server a bit early so it lets them start
            this.webServer = new WebServer(this.workspaceManager.appMiddleware)
            await this.webServer.start()
          }
        },
        async () => {
          if (!singleUseMode) {
            this.authServer = new AuthServer()
            await this.authServer.start()
          }
        },
        async () => {
          if (!singleUseMode) {
            // depends on cosal
            this.topicsManager = new TopicsManager({ cosal: this.cosalManager.cosal })
            await this.topicsManager.start()
          }
        },
        async () => {
          if (!singleUseMode) {
            this.onboardManager = new OnboardManager()
            await this.onboardManager.start()
          }
        },
        async () => {
          if (!singleUseMode) {
            this.orbitDataManager = new OrbitDataManager()
            await this.orbitDataManager.start()
          }
        },
      ],
      {
        timeout: 3000,
      },
    )

    this.registerREPLGlobals()

    // pass dependencies into here as arguments to be clear
    const mediatorPort = this.registerMediatorServer()

    // start announcing on bonjour
    log.verbose(`Starting Bonjour service on ${mediatorPort}`)
    this.bonjour = bonjour()
    this.bonjourService = this.bonjour.publish({
      name: 'orbitDesktop',
      type: 'orbitDesktop',
      port: mediatorPort,
    })
    this.bonjourService.start()

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

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private registerMediatorServer() {
    const cosal = this.cosalManager && this.cosalManager.cosal

    const workersTransport = new WebSocketClientTransport(
      'workers',
      new ReconnectingWebSocket(`ws://localhost:${getGlobalConfig().ports.workersMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    )

    const client = new MediatorClient({ transports: [workersTransport] })

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
        ...loadAppDefinitionResolvers(),
        ...this.workspaceManager.getResolvers(),
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
        createAppCreateNewResolver(this),
        AppRemoveResolver,
        NewFallbackServerPortResolver,
        ...getCosalResolvers(cosal),
        resolveMany(SearchResultModel, async args => {
          return await new SearchResultResolver(cosal, args).resolve()
        }),
        getSalientWordsResolver(cosal),
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
