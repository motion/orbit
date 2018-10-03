import { Logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import { ConfluenceLoader, ConfluenceUser } from '@mcro/services'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { ConfluenceBitFactory } from './ConfluenceBitFactory'
import { ConfluencePersonFactory } from './ConfluencePersonFactory'

/**
 * Syncs Confluence pages and blogs.
 */
export class ConfluenceSyncer {
  private log: Logger
  private loader: ConfluenceLoader
  private bitFactory: ConfluenceBitFactory
  private personFactory: ConfluencePersonFactory
  private personSyncer: PersonSyncer
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(setting: Setting) {
    this.log = new Logger('syncer:confluence:' + setting.id)
    this.loader = new ConfluenceLoader(setting, this.log)
    this.bitFactory = new ConfluenceBitFactory(setting)
    this.personFactory = new ConfluencePersonFactory(setting)
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
    this.log.timer(`load people, person bits and bits from the database`, { dbPeople, dbPersonBits, dbBits })

    // load users from confluence API
    this.log.info('loading confluence API users')
    const allUsers = await this.loader.loadUsers()
    this.log.info('got confluence API users', allUsers)

    // we don't need some confluence users, like system or bot users
    // so we are filtering them out
    this.log.info('filter out users we don\'t need')
    const filteredUsers = allUsers.filter(member => this.checkUser(member))
    this.log.info('users were filtered out', filteredUsers)

    // create people for loaded user
    this.log.info('creating people for api users')
    const apiPeople = filteredUsers.map(user => this.personFactory.create(user))
    this.log.info('people created', apiPeople)

    // saving people and person bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })

    // reload database people again
    const allDbPeople = await this.syncerRepository.loadDatabasePeople()

    // load api confluence issues
    this.log.timer('load API blogs and pages')
    const contents = await this.loader.loadContents()
    this.log.timer('load API blogs and pages', contents)

    // create bits from them and save them
    const apiBits = contents.map(issue => this.bitFactory.create(issue, allDbPeople))
    await this.bitSyncer.sync({ apiBits, dbBits })
  }

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  private checkUser(user: ConfluenceUser): boolean {
    const email = user.details.personal.email || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

}
