import { getGlobalConfig } from '@mcro/config'
import { BitEntity, Entities, JobEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { MediatorServer, typeormResolvers, WebSocketServerTransport } from '@mcro/mediator'
import { BitUtils } from '@mcro/model-utils'
import { BitModel, JobModel, PersonBitModel, PersonModel, SettingForceSyncCommand, SettingModel } from '@mcro/models'
import root from 'global'
import * as Path from 'path'
import * as typeorm from 'typeorm'
import { Connection, createConnection } from 'typeorm'
import { SyncerGroup } from './core/SyncerGroup'
import { SettingForceSyncResolver } from './resolvers/SettingForceSyncResolver'
import { Syncers } from './Syncers'
// import iohook from 'iohook'

// const log = new Logger('orbit-syncers')

export class OrbitSyncersRoot {
  config = getGlobalConfig()
  connection: Connection
  mediator: MediatorServer

  async start() {
    await this.createDbConnection()
    this.setupMediatorServer()
    this.registerREPLGlobals()
    this.startSyncers()
  }

  async dispose() {
    await this.connection.close()
    await this.stopSyncers()
    return true
  }

  private async createDbConnection(): Promise<void> {

    const Config = getGlobalConfig()
    const env = process.env.NODE_ENV !== 'development' ? 'orbit' : 'dev'
    const DATABASE_PATH = Path.join(
      Config.paths.userData,
      `${env}_database.sqlite`,
    )

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
    root.Syncers = Syncers.reduce((map, syncerOrGroup) => {
      // since Syncers is an array we need to convert it to object
      // to make them more usable in the REPL.
      // we are using Syncer constructor name as an object key.
      if (syncerOrGroup instanceof SyncerGroup) {
        map[syncerOrGroup.name] = syncerOrGroup
        for (let syncer of syncerOrGroup.syncers) {
          map[syncer.name] = syncer
        }
      } else {
        map[syncerOrGroup.name] = syncerOrGroup
      }
      return map
    }, {})

    // root.save = async (count: number) => {
    //   const setting = await getRepository(SettingEntity).findOne(1)
    //   const bitCount = await getRepository(BitEntity).count()
    //   const bits: any[] = []
    //   for (let i = 0; i < count; i++) {
    //     bits.push(BitUtils.create({
    //       id: 1000 + bitCount + i,
    //       integration: 'test' as any,
    //       title: '3My bit #' + (bitCount + i),
    //       body: '',
    //       type: 'custom',
    //       bitCreatedAt: Date.now(),
    //       bitUpdatedAt: Date.now(),
    //       settingId: setting.id,
    //     }))
    //   }
    //   console.log("saving bit", bits)
    //   console.time("saving bits")
    //   await getRepository(BitEntity).save(bits, { chunk: 100, transaction: false })
    //   console.timeEnd("saving bits")
    // }
  }

  /**
   * Registers a mediator server which is responsible
   * for communication between processes.
   */
  private setupMediatorServer(): void {
    this.mediator = new MediatorServer({
      models: [
        SettingModel,
        BitModel,
        JobModel,
        PersonModel,
        PersonBitModel,
      ],
      commands: [
        SettingForceSyncCommand,
      ],
      transport: new WebSocketServerTransport({
        port: 40001, // todo: use config?
      }),
      resolvers: [
        ...typeormResolvers(this.connection, [
          { entity: SettingEntity, models: [SettingModel] },
          { entity: BitEntity, models: [BitModel] },
          { entity: JobEntity, models: [JobModel] },
          { entity: PersonEntity, models: [PersonModel] },
          { entity: PersonBitEntity, models: [PersonBitModel] },
        ]),
        SettingForceSyncResolver,
      ],
    })
    this.mediator.bootstrap()
  }

  /**
   * Starts all the syncers.
   * We start syncers with a small timeout to prevent app-overload.
   */
  private startSyncers() {
    setTimeout(
      () =>
        Promise.all(
          Syncers.map(syncer => {
            return syncer.start()
          }),
        ),
      10000,
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
