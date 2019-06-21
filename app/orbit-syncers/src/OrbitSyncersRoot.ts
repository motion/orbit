import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import {
  MediatorClient,
  MediatorServer,
  typeormResolvers,
  WebSocketClientTransport,
  WebSocketServerTransport,
} from '@o/mediator'
import { Entities, JobEntity, JobModel, AppModel, AppEntity } from '@o/models'
import root from 'global'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { Connection, createConnection } from 'typeorm'
// import { Syncers } from './Syncers'
import { AppForceCancelResolver } from './resolvers/AppForceCancelResolver'
import { AppForceSyncResolver } from './resolvers/AppForceSyncResolver'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS } from '@o/worker-kit'
import { WorkersManager } from './WorkersManager'

export class OrbitSyncersRoot {
  config = getGlobalConfig()
  connection: Connection
  mediatorServer: MediatorServer
  mediatorClient: MediatorClient

  // managers
  workersManager = new WorkersManager()

  async start() {
    this.registerREPLGlobals()
    await this.createDbConnection()
    this.setupMediatorServer()

    this.mediatorClient = new MediatorClient({
      transports: [
        new WebSocketClientTransport(
          'syncers', // randomString(5)
          new ReconnectingWebSocket(
            `ws://localhost:${getGlobalConfig().ports.desktopMediator}`,
            [],
            {
              WebSocket,
              minReconnectionDelay: 1,
            },
          ),
        ),
      ],
    })

    __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS.setMediatorClient(this.mediatorClient)

    // setup proper instances to use inside sync-kit package
    setTimeout(() => {
      this.startSyncers()
    }, 10000)
  }

  async dispose() {
    if (this.connection) {
      await this.connection.close()
      await this.stopSyncers()
    }
    return true
  }

  private async createDbConnection(): Promise<void> {
    const Config = getGlobalConfig()
    const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'
    const DATABASE_PATH = Path.join(Config.paths.userData, `${env}_database.sqlite`)

    this.connection = await createConnection({
      name: 'default',
      type: 'sqlite',
      database: DATABASE_PATH,
      // location: 'default',
      entities: Entities,
      logging: ['error'],
      logger: 'simple-console',
      synchronize: false,
      busyErrorRetry: 1000,
      maxQueryExecutionTime: 3000,
      enableWAL: true,
    })
  }

  /**
   * Registers global variables in the REPL.
   * Used for the development purposes.
   */
  private registerREPLGlobals() {
    root.typeorm = typeorm
    root.root = this
    root.Logger = Logger
    root.mediatorServer = this.mediatorServer
    console.log('syncers...')
    // root.Syncers = Syncers.reduce((map, syncer) => {
    //   map[syncer.name] = syncer
    //   return map
    // }, {})
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private setupMediatorServer(): void {
    this.mediatorServer = new MediatorServer({
      models: [AppModel, JobModel],
      transport: new WebSocketServerTransport({
        port: getGlobalConfig().ports.syncersMediator,
      }),
      resolvers: [
        ...typeormResolvers(this.connection, [
          { entity: AppEntity, models: [AppModel] },
          { entity: JobEntity, models: [JobModel] },
        ]),
        AppForceSyncResolver,
        AppForceCancelResolver,
      ],
    })
    this.mediatorServer.bootstrap()
  }

  /**
   * Starts all the syncers.
   * We start syncers with a small timeout to prevent app-overload.
   */
  private async startSyncers() {
    // await Promise.all(
    //   Syncers.map(syncer => {
    //     return syncer.start()
    //   }),
    // )
  }

  /**
   * Stops all the syncers.
   */
  private async stopSyncers() {
    // await Promise.all(
    //   Syncers.map(syncer => {
    //     return syncer.stop()
    //   }),
    // )
  }
}

export const syncersRoot = new OrbitSyncersRoot()
