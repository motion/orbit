import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { MediatorServer, typeormResolvers, WebSocketServerTransport } from '@o/mediator'
import { Entities, JobEntity, JobModel, AppModel, AppEntity } from '@o/models'
import root from 'global'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { Connection, createConnection } from 'typeorm'
import { AppForceCancelResolver } from './resolvers/AppForceCancelResolver'
import { AppForceSyncResolver } from './resolvers/AppForceSyncResolver'
import { __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS } from '@o/worker-kit'
import { WorkersManager } from './WorkersManager'
import { mediatorClient } from './mediatorClient'

const log = new Logger('WorkersRoot')

export class OrbitWorkersRoot {
  config = getGlobalConfig()
  connection: Connection
  mediatorServer: MediatorServer
  mediatorClient = mediatorClient

  // managers
  workersManager = new WorkersManager()

  async start() {
    log.info(`Starting Orbit Workers`)
    this.registerREPLGlobals()
    await this.createDbConnection()
    this.setupMediatorServer()
    __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS.setMediatorClient(this.mediatorClient)
    await this.workersManager.start()
  }

  async dispose() {
    if (this.connection) {
      await this.connection.close()
      await this.workersManager.stop()
    }
    return true
  }

  private async createDbConnection(): Promise<void> {
    const Config = getGlobalConfig()

    const isDevelopment = process.env.NODE_ENV === 'development'
    const DATABASE_PATH = Path.join(
      Config.paths.userData,
      isDevelopment ? `development_database.sqlite` : `orbit_database.sqlite`,
    )

    this.connection = await createConnection({
      name: 'default',
      type: 'sqlite',
      database: DATABASE_PATH,
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
    root.Entities = Entities
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private setupMediatorServer(): void {
    this.mediatorServer = new MediatorServer({
      models: [AppModel, JobModel],
      transport: new WebSocketServerTransport({
        port: getGlobalConfig().ports.workersMediator,
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
}

export const workersRoot = new OrbitWorkersRoot()
