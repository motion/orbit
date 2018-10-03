import { Logger } from '@mcro/logger'
import { Bit, Person, Setting } from '@mcro/models'
import { DriveLoader } from '@mcro/services'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { DriveBitFactory } from './DriveBitFactory'
import { DrivePersonFactory } from './DrivePersonFactory'

/**
 * Syncs Google Drive files.
 */
export class DriveSyncer implements IntegrationSyncer {
  private setting: Setting
  private log: Logger
  private loader: DriveLoader
  private bitFactory: DriveBitFactory
  private personFactory: DrivePersonFactory
  private personSyncer: PersonSyncer
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(setting: Setting) {
    this.setting = setting
    this.log = new Logger('syncer:drive:' + setting.id)
    this.loader = new DriveLoader(this.setting)
    this.bitFactory = new DriveBitFactory(setting)
    this.personFactory = new DrivePersonFactory(setting)
    this.personSyncer = new PersonSyncer(setting, this.log)
    this.bitSyncer = new BitSyncer(setting, this.log)
    this.syncerRepository = new SyncerRepository(setting)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {

    // load database data
    this.log.timer(`load people, person bits and bits from the database`)
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
    const dbPersonBits = await this.syncerRepository.loadDatabasePersonBits({ people: dbPeople })
    const dbBits = await this.syncerRepository.loadDatabaseBits()
    this.log.timer(`load people, person bits and bits from the database`, {
      dbPeople,
      dbPersonBits,
      dbBits,
    })

    // load users from API
    this.log.timer('load files and people from API')
    const files = await this.loader.load()
    this.log.timer('load files and people from API', files)

    // create people for loaded user
    this.log.timer('create people and bits for api files and people')
    const apiBits: Bit[] = [], apiPeople: Person[] = []
    for (let file of files) {
      const bit = this.bitFactory.create(file)
      bit.people = file.users.map(user => this.personFactory.create(user))
      apiPeople.push(...bit.people.filter(person => !apiPeople.find(apiPerson => apiPerson.id === person.id)))
      apiBits.push(bit)
    }
    this.log.timer('create people and bits for api files and people', { apiBits, apiPeople })

    // saving people and person bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })
    await this.bitSyncer.sync({ apiBits, dbBits })
  }

}
