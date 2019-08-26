import Observable from 'zen-observable'
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
  resolveObserveOne,
} from '@o/mediator'
import {
  SettingEntity,
  SettingModel,
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
  OrbitProcessStdOutModel,
  WindowMessageModel,
  ResetDataCommand,
  NewFallbackServerPortCommand,
  BuildStatusModel,
  WorkspaceInfoModel,
  OracleWordsFoundModel,
} from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import bonjour from 'bonjour'
import { writeJSONSync } from 'fs-extra'
import global from 'global'
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
import { getSalientWordsResolver } from './resolvers/SalientWordsResolver'
import { SearchResultResolver } from './resolvers/SearchResultResolver'
import { SendClientDataResolver } from './resolvers/SendClientDataResolver'
import { WebServer } from './WebServer'
import { GraphServer } from './GraphServer'
import { loadAppDefinitionResolvers } from './resolvers/loadAppDefinitionResolvers'
import { FinishAuthQueue } from './auth-server/finishAuth'
import { createAppCreateNewResolver } from './resolvers/AppCreateNewResolver'
import { WorkspaceManager } from './WorkspaceManager/WorkspaceManager'
import { orTimeout, OR_TIMED_OUT } from '@o/utils'
import { interceptStdOut } from './helpers/interceptStdOut'
import { appStatusManager, AppStatusManager } from './managers/AppStatusManager'
import { OracleManager } from './managers/OracleManager'

const log = new Logger('OrbitDesktopRoot')
const Config = getGlobalConfig()

type AsyncFn = () => Promise<any>

async function asyncRun(
  fns: (AsyncFn | { parallel: AsyncFn[] })[],
  options: {
    timeout?: number
  } = {},
) {
  log.verbose(`asyncRun ${fns.length}`)
  for (const [index, item] of fns.entries()) {
    log.verbose(`asyncRun, start function ${index}`, item, options.timeout)
    const runItem = async () => {
      if (typeof item === 'function') {
        await item()
      }
      if ('parallel' in item) {
        await Promise.all(item.parallel.map(x => x()))
      }
    }
    try {
      if (options.timeout) {
        await orTimeout(runItem(), options.timeout)
      } else {
        await runItem()
      }
    } catch (err) {
      if (err === OR_TIMED_OUT) {
        log.error('Timed out starting', item)
      }
      log.error('got real err', err)
      throw err
    }
  }
}

export class OrbitDesktopRoot {
  // public
  stores = null
  resolveWaitForElectronMediator: Function | null = null
  databaseManager: DatabaseManager
  mediatorServer: MediatorServer

  config = Config
  authServer: AuthServer
  graphServer: GraphServer
  onboardManager: OnboardManager
  disposed = false
  webServer: WebServer
  bonjour: bonjour.Bonjour
  bonjourService: bonjour.Service
  searchResultResolver: SearchResultResolver

  // managers
  workspaceManager: WorkspaceManager
  orbitDataManager: OrbitDataManager
  cosalManager: CosalManager
  generalSettingManager: GeneralSettingManager
  topicsManager: TopicsManager
  operatingSystemManager: OperatingSystemManager
  oracleManager: OracleManager

  // attaching here for debugging
  appStatusManager: AppStatusManager = appStatusManager

  start = async () => {
    // this is if we are running a CLI command that exits on finish
    const singleUseMode = !!process.env.SINGLE_USE_MODE
    log.verbose(`start(), singleUseMode ${singleUseMode}`)

    this.registerREPLGlobals()

    /**
     * Next step for asyncRun would be instead to have a proper graph based on deps.
     */
    await asyncRun(
      [
        {
          parallel: [
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
          ],
        },
        async () => {
          this.workspaceManager = new WorkspaceManager(this.mediatorServer, {
            singleUseMode,
          })
          await this.workspaceManager.start()
        },
        async () => {
          if (!singleUseMode) {
            // the electron app wont start until this runs
            // start server a bit early so it lets them start
            this.webServer = new WebServer({
              middlewares: [this.workspaceManager.middleware],
            })
            await this.webServer.start()
          }
        },
        {
          parallel: [
            async () => {
              if (!singleUseMode) {
                // run this early, it sets up the general setting if needed
                this.generalSettingManager = new GeneralSettingManager()
                await this.generalSettingManager.start()
              }
            },
            async () => {
              if (!singleUseMode) {
                // manages operating system state
                this.operatingSystemManager = new OperatingSystemManager()
                await this.operatingSystemManager.start()
              }
            },
            async () => {
              if (!singleUseMode) {
                // search index
                this.cosalManager = new CosalManager({ dbPath: COSAL_DB })
                await this.cosalManager.start()
                this.searchResultResolver = new SearchResultResolver(this.cosalManager.cosal)
              }
            },
          ],
        },
        {
          parallel: [
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
            async () => {
              log.info(`process.env.ENABLE_OCR = ${process.env.ENABLE_OCR}`)
              if (!singleUseMode && process.env.ENABLE_OCR) {
                this.oracleManager = new OracleManager()
                await this.oracleManager.start()
              }
            },
          ],
        },
      ],
      {
        timeout: 3000,
      },
    )

    // pass dependencies into here as arguments to be clear
    const mediatorPort = this.registerMediatorServer()

    if (!process.env.SINGLE_USE_MODE) {
      await new Promise(res => {
        this.resolveWaitForElectronMediator = res
      })
    }

    log.verbose(`Starting Bonjour service on ${mediatorPort}`)
    this.bonjour = bonjour()
    this.bonjourService = this.bonjour.publish({
      name: 'orbitDesktop',
      type: 'orbitDesktop',
      port: mediatorPort,
    })
    this.bonjourService.start()

    log.info('DESKTOP FINISHED START()')
  }

  restart = () => {
    require('touch')(Path.join(__dirname, '..', '_', 'main.js'))
  }

  dispose = async () => {
    require('fs').writeFileSync('/tmp/hi', 'hi')
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
    if (this.oracleManager) {
      await this.oracleManager.stop()
    }
    this.disposed = true
    return true
  }

  /**
   * Registers global variables in the REPL.
   * Used for the development purposes.
   */
  private registerREPLGlobals() {
    global.typeorm = typeorm
    global.Root = this
    global.restart = this.restart
    global.Logger = Logger
    global.mediatorServer = this.mediatorServer
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private registerMediatorServer() {
    const cosal = this.cosalManager && this.cosalManager.cosal

    const workersTransport = new WebSocketClientTransport(
      'workers',
      new ReconnectingWebSocket(`ws://localhost:${Config.ports.workersMediator}`, [], {
        WebSocket,
        minReconnectionDelay: 1,
      }),
    )

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
        WindowMessageModel,
        OrbitProcessStdOutModel,
        BuildStatusModel,
        WorkspaceInfoModel,
        SettingModel,
        OracleWordsFoundModel,
      ],
      transport: new WebSocketServerTransport({
        port: mediatorServerPort,
      }),
      fallbackClient: new MediatorClient({ transports: [workersTransport] }),
      resolvers: [
        ...typeormResolvers(getConnection(), [
          { entity: AppEntity, models: [AppModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: SpaceEntity, models: [SpaceModel] },
          { entity: UserEntity, models: [UserModel] },
          { entity: StateEntity, models: [StateModel] },
          { entity: SettingEntity, models: [SettingModel] },
        ]),

        // this is a generic bus that routes all our Logger output out
        resolveObserveOne(OrbitProcessStdOutModel, () => {
          return new Observable<string>(observer => {
            interceptStdOut(message => {
              observer.next(message)
            })
          })
        }),

        // this is a generic bus that lets us send explicit message events out
        resolveObserveOne(WindowMessageModel, args => {
          return appStatusManager.observe(args.windowId)
        }),

        ...loadAppDefinitionResolvers(),

        // children resolvers
        ...this.workspaceManager.getResolvers(),
        ...((this.oracleManager && this.oracleManager.getResolvers()) || []),

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
        (() => {
          let lastUsed = 0
          return resolveCommand(NewFallbackServerPortCommand, () => {
            if (this.resolveWaitForElectronMediator) {
              this.resolveWaitForElectronMediator()
              this.resolveWaitForElectronMediator = null
            }
            const port = Config.ports.electronMediators[lastUsed]
            lastUsed++
            const server = global.mediatorServer as MediatorServer
            // mutate, bad for now but we'd need to refactor MediatorServer
            server.options.fallbackClient.options.transports.push(
              new WebSocketClientTransport(
                'electron',
                new ReconnectingWebSocket(`ws://localhost:${port}`, [], {
                  WebSocket,
                  minReconnectionDelay: 1,
                }),
              ),
            )
            return port
          })
        })(),
        ...getCosalResolvers(cosal),
        resolveMany(SearchResultModel, async args => {
          return await this.searchResultResolver.execute(args)
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
          const url = `${Config.urls.auth}/auth/${authKey}`
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
    global.mediatorServer = this.mediatorServer

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
