import { getGlobalConfig } from '@mcro/config'
import {
  AppEntity,
  BitEntity,
  Entities,
  JobEntity,
  PersonBitEntity,
  PersonEntity,
  SettingEntity,
  SourceEntity,
  SpaceEntity,
  UserModel,
  UserEntity,
  SourceForceCancelCommand,
} from '@mcro/models'
import { Logger } from '@mcro/logger'
import { MediatorServer, typeormResolvers, WebSocketServerTransport } from '@mcro/mediator'
import {
  AppModel,
  BitModel,
  JobModel,
  PersonBitModel,
  PersonModel,
  SettingModel,
  SourceForceSyncCommand,
  SourceModel,
  SpaceModel,
} from '@mcro/models'
import root from 'global'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { Connection, createConnection } from 'typeorm'
import { Syncers } from './core/Syncers'
import { SourceForceSyncResolver } from './resolvers/SourceForceSyncResolver'
import { SourceForceCancelResolver } from './resolvers/SourceForceCancelResolver'

export class OrbitSyncersRoot {
  config = getGlobalConfig()
  connection: Connection
  mediatorServer: MediatorServer

  async start() {
    this.registerREPLGlobals()
    await this.createDbConnection()
    this.setupMediatorServer()

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
    root.Syncers = Syncers.reduce((map, syncer) => {
      map[syncer.name] = syncer
      return map
    }, {})
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private setupMediatorServer(): void {
    this.mediatorServer = new MediatorServer({
      models: [
        AppModel,
        SettingModel,
        SourceModel,
        BitModel,
        JobModel,
        PersonModel,
        PersonBitModel,
        SpaceModel,
        UserModel,
      ],
      commands: [SourceForceSyncCommand, SourceForceCancelCommand],
      transport: new WebSocketServerTransport({
        port: getGlobalConfig().ports.syncersMediator,
      }),
      resolvers: [
        ...typeormResolvers(this.connection, [
          { entity: AppEntity, models: [AppModel] },
          { entity: SettingEntity, models: [SettingModel] },
          { entity: SourceEntity, models: [SourceModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: JobEntity, models: [JobModel] },
          { entity: PersonEntity, models: [PersonModel] },
          { entity: PersonBitEntity, models: [PersonBitModel] },
          { entity: SpaceEntity, models: [SpaceModel] },
          { entity: UserEntity, models: [UserModel] },
        ]),
        SourceForceSyncResolver,
        SourceForceCancelResolver,
      ],
    })
    this.mediatorServer.bootstrap()
  }

  /**
   * Starts all the syncers.
   * We start syncers with a small timeout to prevent app-overload.
   */
  private async startSyncers() {
    await Promise.all(
      Syncers.map(syncer => {
        return syncer.start()
      }),
    )
  }

  /**
   * Stops all the syncers.
   */
  private async stopSyncers() {
    await Promise.all(
      Syncers.map(syncer => {
        return syncer.stop()
      }),
    )
  }
}
