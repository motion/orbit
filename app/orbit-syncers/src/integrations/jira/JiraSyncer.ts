import { Logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import { JiraLoader, JiraUser } from '@mcro/services'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { JiraBitFactory } from './JiraBitFactory'
import { JiraPersonFactory } from './JiraPersonFactory'

/**
 * Syncs Jira issues.
 */
export class JiraSyncer implements IntegrationSyncer {
  private log: Logger
  private loader: JiraLoader
  private bitFactory: JiraBitFactory
  private personFactory: JiraPersonFactory
  private personSyncer: PersonSyncer
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(setting: Setting) {
    this.log = new Logger('syncer:jira:' + setting.id)
    this.loader = new JiraLoader(setting, this.log)
    this.bitFactory = new JiraBitFactory(setting)
    this.personFactory = new JiraPersonFactory(setting)
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

    // load users from jira API
    this.log.timer('load API people')
    const apiUsers = await this.loader.loadUsers()
    this.log.timer('load API people', apiUsers)

    // we don't need some jira users, like system or bot users
    // so we are filtering them out
    this.log.info('filter out users we don\'t need')
    const filteredUsers = apiUsers.filter(user => this.checkUser(user))
    this.log.info('users were filtered out', filteredUsers)

    // create people for loaded user
    this.log.info('creating people for api users')
    const apiPeople = filteredUsers.map(user => this.personFactory.create(user))
    this.log.info('people created', apiPeople)

    // saving people and person bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })

    // reload database people again
    const allDbPeople = await this.syncerRepository.loadDatabasePeople()

    // load api jira issues
    this.log.timer('load API jira issues')
    const issues = await this.loader.loadIssues()
    this.log.timer('load API jira issues', issues)

    // create bits from them and save them
    const apiBits = issues.map(issue => this.bitFactory.create(issue, allDbPeople))
    await this.bitSyncer.sync({ apiBits, dbBits })
  }

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  private checkUser(user: JiraUser): boolean {
    const email = user.emailAddress || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

}
