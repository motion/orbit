import { Logger } from '@mcro/logger'
import { AppEntity, Bit, BitEntity, BitUtils, JiraApp, JiraBitData } from '@mcro/models'
import { JiraAppData } from '@mcro/models/_/interfaces/app-data/JiraAppData'
import { JiraIssue, JiraLoader, JiraUser } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { AppSyncer } from '../../core/AppSyncer'
import { SyncerUtils } from '../../core/SyncerUtils'
import { checkCancelled } from '../../resolvers/AppForceCancelResolver'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'

/**
 * Syncs Jira issues.
 */
export class JiraSyncer implements AppSyncer {
  private log: Logger
  private app: JiraApp
  private loader: JiraLoader
  private personSyncer: PersonSyncer
  private syncerRepository: SyncerRepository

  constructor(source: JiraApp, log?: Logger) {
    this.log = log || new Logger('syncer:jira:' + source.id)
    this.app = source
    this.loader = new JiraLoader(source, this.log)
    this.personSyncer = new PersonSyncer(this.log)
    this.syncerRepository = new SyncerRepository(source)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    if (!this.app.data.values.lastSync) this.app.data.values.lastSync = {}
    const lastSync = this.app.data.values.lastSync

    // load database data
    this.log.timer('load people, person bits and bits from the database')
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
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
    const apiPeople = filteredUsers.map(user => this.createPersonBit(user))
    this.log.info('people created', apiPeople)

    // saving people and person bits
    await this.personSyncer.sync(apiPeople, dbPeople)

    // load all people (once again after sync)
    const allDbPeople = await this.syncerRepository.loadDatabasePeople()

    // load users from API
    this.log.timer('load issues from API')
    const files = await this.loader.loadIssues(
      lastSync.lastCursor || 0,
      lastSync.lastCursorLoadedCount || 0,
      async (issue, cursor, loadedCount, isLast) => {
        await checkCancelled(this.app.id)
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
          await getRepository(AppEntity).save(this.app)

          return false // this tells from the callback to stop file proceeding
        }

        // for the first ever synced issue we store its updated date, and once sync is done,
        // next time we make sync again we don't want to sync issues less then this date
        if (!lastSync.lastCursorSyncedDate) {
          lastSync.lastCursorSyncedDate = updatedAt
          this.log.info('looks like its the first syncing issue, set last synced date', lastSync)
          await getRepository(AppEntity).save(this.app)
        }

        const bit = this.createDocumentBit(issue, allDbPeople)
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
          await getRepository(AppEntity).save(this.app)
          return true
        }

        // update last sync settings to make sure we continue from the last point in the case if application will stop
        if (lastSync.lastCursor !== cursor) {
          this.log.info('updating last cursor in settings', { cursor })
          lastSync.lastCursor = cursor
          lastSync.lastCursorLoadedCount = loadedCount
          await getRepository(AppEntity).save(this.app)
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

  /**
   * Builds a bit from the given jira issue.
   */
  private createDocumentBit(issue: JiraIssue, allPeople: Bit[]): Bit {
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()
    const values = this.app.data.values as JiraAppData['values']
    const domain = values.credentials.domain
    const body = SyncerUtils.stripHtml(issue.renderedFields.description)
    const cleanHtml = SyncerUtils.sanitizeHtml(issue.renderedFields.description)

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = []
    if (issue.fields.comment)
      peopleIds.push(...issue.comments.map(comment => comment.author.accountId))
    if (issue.fields.assignee) peopleIds.push(issue.fields.assignee.accountId)
    if (issue.fields.creator) peopleIds.push(issue.fields.creator.accountId)
    if (issue.fields.reporter) peopleIds.push(issue.fields.reporter.accountId)

    const people = allPeople.filter(person => {
      return peopleIds.indexOf(person.originalId) !== -1
    })

    // find original content creator
    const author = allPeople.find(person => {
      return person.originalId === issue.fields.creator.accountId
    })

    // create or update a bit
    return BitUtils.create(
      {
        appType: 'jira',
        appId: this.app.id,
        type: 'document',
        title: issue.fields.summary,
        body,
        author,
        data: {
          content: cleanHtml,
        } as JiraBitData,
        location: {
          id: issue.fields.project.id,
          name: issue.fields.project.name,
          webLink: domain + '/browse/' + issue.fields.project.key,
          desktopLink: '',
        },
        webLink: domain + '/browse/' + issue.key,
        people,
        bitCreatedAt,
        bitUpdatedAt,
      },
      issue.id,
    )
  }

  /**
   * Creates person entity from a given Jira user.
   */
  createPersonBit(user: JiraUser): Bit {
    return BitUtils.create(
      {
        appType: 'jira',
        appId: this.app.id,
        type: 'person',
        originalId: user.accountId,
        title: user.displayName,
        email: user.emailAddress,
        photo: user.avatarUrls['48x48'].replace('s=48', 's=512'),
      },
      user.accountId,
    )
  }
}
