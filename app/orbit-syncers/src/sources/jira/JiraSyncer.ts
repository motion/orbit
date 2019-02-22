import { Logger } from '@mcro/logger'
import { BitEntity, JiraSource, SourceEntity } from '@mcro/models'
import { JiraLoader, JiraUser } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { SourceSyncer } from '../../core/SourceSyncer'
import { checkCancelled } from '../../resolvers/SourceForceCancelResolver'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { JiraBitFactory } from './JiraBitFactory'
import { JiraPersonFactory } from './JiraPersonFactory'

/**
 * Syncs Jira issues.
 */
export class JiraSyncer implements SourceSyncer {
  private log: Logger
  private source: JiraSource
  private loader: JiraLoader
  private bitFactory: JiraBitFactory
  private personFactory: JiraPersonFactory
  private personSyncer: PersonSyncer
  private syncerRepository: SyncerRepository

  constructor(source: JiraSource, log?: Logger) {
    this.log = log || new Logger('syncer:jira:' + source.id)
    this.source = source
    this.loader = new JiraLoader(source, this.log)
    this.bitFactory = new JiraBitFactory(source)
    this.personFactory = new JiraPersonFactory(source)
    this.personSyncer = new PersonSyncer(this.log)
    this.syncerRepository = new SyncerRepository(source)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    if (!this.source.values.lastSync) this.source.values.lastSync = {}
    const lastSync = this.source.values.lastSync

    // load database data
    this.log.timer('load people, person bits and bits from the database')
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
    const dbPersonBits = await this.syncerRepository.loadDatabasePersonBits({ people: dbPeople })
    this.log.timer('load people, person bits and bits from the database', dbPeople)

    // load users from jira API
    this.log.timer('load API people')
    const apiUsers = await this.loader.loadUsers()
    this.log.timer('load API people', apiUsers)

    // we don't need some jira users, like system or bot users
    // so we are filtering them out
    this.log.info("filter out users we don't need")
    const filteredUsers = apiUsers.filter(user => this.checkUser(user))
    this.log.info('updated users after filtering', filteredUsers)

    // create people for loaded user
    this.log.info('creating people for api users')
    const apiPeople = filteredUsers.map(user => this.personFactory.create(user))
    this.log.info('people created', apiPeople)

    // saving people and person bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })

    // load all people (once again after sync)
    const allDbPeople = await this.syncerRepository.loadDatabasePeople()

    // load users from API
    this.log.timer('load issues from API')
    const files = await this.loader.loadIssues(
      lastSync.lastCursor || 0,
      lastSync.lastCursorLoadedCount || 0,
      async (issue, cursor, loadedCount, isLast) => {
        await checkCancelled(this.source.id)
        await sleep(2)

        const updatedAt = new Date(issue.fields.updated).getTime()

        // if we have synced stuff previously already, we need to prevent same issues syncing
        // check if issue's updated date is newer than our last synced date
        if (lastSync.lastSyncedDate && updatedAt <= lastSync.lastSyncedDate) {
          this.log.info('reached last synced date, stop syncing...', { issue, updatedAt, lastSync })

          // if its actually older we don't need to sync this issue and all next ones (since they are sorted by updated date)
          if (lastSync.lastCursorSyncedDate) {
            // important check, because we can be in this block without loading by cursor
            lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
          }
          lastSync.lastCursor = undefined
          lastSync.lastCursorSyncedDate = undefined
          await getRepository(SourceEntity).save(this.source)

          return false // this tells from the callback to stop file proceeding
        }

        // for the first ever synced issue we store its updated date, and once sync is done,
        // next time we make sync again we don't want to sync issues less then this date
        if (!lastSync.lastCursorSyncedDate) {
          lastSync.lastCursorSyncedDate = updatedAt
          this.log.info('looks like its the first syncing issue, set last synced date', lastSync)
          await getRepository(SourceEntity).save(this.source)
        }

        const bit = this.bitFactory.create(issue, allDbPeople)
        this.log.verbose('syncing', { issue, bit, people: bit.people })
        await getRepository(BitEntity).save(bit, { listeners: false })

        // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
        if (isLast) {
          this.log.info(
            'looks like its the last issue in this sync, removing last cursor and source last sync date',
            lastSync,
          )
          lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
          lastSync.lastCursor = undefined
          lastSync.lastCursorSyncedDate = undefined
          await getRepository(SourceEntity).save(this.source)
          return true
        }

        // update last sync settings to make sure we continue from the last point in the case if application will stop
        if (lastSync.lastCursor !== cursor) {
          this.log.info('updating last cursor in settings', { cursor })
          lastSync.lastCursor = cursor
          lastSync.lastCursorLoadedCount = loadedCount
          await getRepository(SourceEntity).save(this.source)
        }

        return true
      },
    )
    this.log.timer('load issues from API', files)
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
