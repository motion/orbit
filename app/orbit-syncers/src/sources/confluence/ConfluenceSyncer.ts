import { Logger } from '@mcro/logger'
import {
  AppEntity,
  Bit,
  BitEntity,
  BitUtils,
  ConfluenceApp,
  ConfluenceBitData,
  ConfluenceLastSyncInfo,
} from '@mcro/models'
import { ConfluenceContent, ConfluenceLoader, ConfluenceUser } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { SyncerUtils } from '../../core/SyncerUtils'
import { checkCancelled } from '../../resolvers/AppForceCancelResolver'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'

/**
 * Syncs Confluence pages and blogs.
 */
export class ConfluenceSyncer {
  private log: Logger
  private app: ConfluenceApp
  private loader: ConfluenceLoader
  private personSyncer: PersonSyncer
  private syncerRepository: SyncerRepository

  constructor(app: ConfluenceApp, log?: Logger) {
    this.log = log || new Logger('syncer:confluence:' + app.id)
    this.app = app
    this.loader = new ConfluenceLoader(app, this.log)
    this.personSyncer = new PersonSyncer(this.log)
    this.syncerRepository = new SyncerRepository(app)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    if (!this.app.data.values.pageLastSync) this.app.data.values.pageLastSync = {}
    const pageLastSync = this.app.data.values.pageLastSync
    if (!this.app.data.values.blogLastSync) this.app.data.values.blogLastSync = {}
    const blogLastSync = this.app.data.values.blogLastSync

    // load database data
    this.log.timer('load person bits from the database')
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
    this.log.timer('load person bits and bits from the database', { dbPeople })

    // load users from confluence API
    this.log.info('loading confluence API users')
    const allUsers = await this.loader.loadUsers()
    this.log.info('got confluence API users', allUsers)

    // we don't need some confluence users, like system or bot users
    // so we are filtering them out
    this.log.info("filter out users we don't need")
    const filteredUsers = allUsers.filter(member => this.checkUser(member))
    this.log.info('updated users after filtering', filteredUsers)

    // create people for loaded user
    this.log.info('creating people for api users')
    const apiPeople = filteredUsers.map(user => this.createPersonBit(user))
    this.log.info('people created', apiPeople)

    // saving people and person bits
    await this.personSyncer.sync(apiPeople, dbPeople)

    // reload database people again
    const allDbPeople = await this.syncerRepository.loadDatabasePeople()

    // sync content - pages
    this.log.timer('sync API pages')
    await this.loader.loadContents(
      'page',
      pageLastSync.lastCursor || 0,
      pageLastSync.lastCursorLoadedCount || 0,
      (content, cursor, loadedCount, isLast) => {
        return this.handleContent({
          content,
          cursor,
          loadedCount,
          isLast,
          lastSyncInfo: pageLastSync,
          allDbPeople,
        })
      },
    )
    this.log.timer('sync API pages')

    // sync content - blogs
    this.log.timer('sync API blogs')
    await this.loader.loadContents(
      'blogpost',
      blogLastSync.lastCursor || 0,
      blogLastSync.lastCursorLoadedCount || 0,
      (content, cursor, loadedCount, isLast) => {
        return this.handleContent({
          content,
          cursor,
          loadedCount,
          isLast,
          lastSyncInfo: blogLastSync,
          allDbPeople,
        })
      },
    )
    this.log.timer('sync API blogs')
  }

  /**
   * Handles a content (blog or page) from loaded confluence content stream.
   */
  private async handleContent(options: {
    lastSyncInfo: ConfluenceLastSyncInfo
    content: ConfluenceContent
    cursor: number
    loadedCount: number
    isLast: boolean
    allDbPeople: Bit[]
  }) {
    await checkCancelled(this.app.id)
    await sleep(2)

    const { lastSyncInfo, content, cursor, loadedCount, isLast, allDbPeople } = options
    const updatedAt = new Date(content.history.lastUpdated.when).getTime()

    // if we have synced stuff previously already, we need to prevent same content syncing
    // check if content's updated date is newer than our last synced date
    if (lastSyncInfo.lastSyncedDate && updatedAt <= lastSyncInfo.lastSyncedDate) {
      this.log.info('reached last synced date, stop syncing...', {
        content,
        updatedAt,
        lastSync: lastSyncInfo,
      })

      // if its actually older we don't need to sync this content and all next ones (since they are sorted by updated date)
      if (lastSyncInfo.lastCursorSyncedDate) {
        // important check, because we can be in this block without loading by cursor
        lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      }
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      await getRepository(AppEntity).save(this.app)

      return false // this tells from the callback to stop file proceeding
    }

    // for the first ever synced content we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync content less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      this.log.info('looks like its the first syncing content, set last synced date', lastSyncInfo)
      await getRepository(AppEntity).save(this.app)
    }

    const bit = this.createDocumentBit(content, allDbPeople)
    this.log.verbose('syncing', { content, bit, people: bit.people })
    await getRepository(BitEntity).save(bit, { listeners: false })

    // in the case if its the last content we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      this.log.info(
        'looks like its the last content in this sync, removing last cursor and app last sync date',
        lastSyncInfo,
      )
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      await getRepository(AppEntity).save(this.app)
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      this.log.info('updating last cursor in settings', { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await getRepository(AppEntity).save(this.app)
    }

    return true
  }

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  private checkUser(user: ConfluenceUser): boolean {
    const email = user.details.personal.email || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

  /**
   * Creates person entity from a given Confluence user.
   */
  private createPersonBit(user: ConfluenceUser): Bit {
    const values = this.app.data.values

    // create or update a bit
    return BitUtils.create(
      {
        appType: 'confluence',
        appId: this.app.id,
        type: 'person',
        originalId: user.accountId,
        title: user.displayName,
        email: user.details.personal.email,
        photo: values.credentials.domain + user.profilePicture.path.replace('s=48', 's=512'),
      },
      user.accountId,
    )
  }

  /**
   * Builds a document bit from the given confluence content.
   */
  private createDocumentBit(content: ConfluenceContent, allPeople: Bit[]): Bit {
    const values = this.app.data.values
    const domain = values.credentials.domain
    const bitCreatedAt = new Date(content.history.createdDate).getTime()
    const bitUpdatedAt = new Date(content.history.lastUpdated.when).getTime()
    const body = SyncerUtils.stripHtml(content.body.styled_view.value)
    let cleanHtml = SyncerUtils.sanitizeHtml(content.body.styled_view.value)
    const matches = content.body.styled_view.value.match(
      /<style default-inline-css>((.|\n)*)<\/style>/gi,
    )
    if (matches) cleanHtml = matches[0] + cleanHtml

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = [
      content.history.createdBy.accountId,
      ...content.comments.map(comment => comment.history.createdBy.accountId),
      ...content.history.contributors.publishers.userAccountIds,
    ]
    const people = allPeople.filter(person => {
      return peopleIds.indexOf(person.originalId) !== -1
    })

    // find original content creator
    const author = allPeople.find(person => {
      return person.originalId === content.history.createdBy.accountId
    })

    // create or update a bit
    return BitUtils.create(
      {
        appType: 'confluence',
        appId: this.app.id,
        type: 'document',
        title: content.title,
        author,
        body,
        data: { content: cleanHtml } as ConfluenceBitData,
        location: {
          id: content.space.id,
          name: content.space.name,
          webLink: domain + '/wiki' + content.space._links.webui,
          desktopLink: '',
        },
        webLink: domain + '/wiki' + content._links.webui,
        people,
        bitCreatedAt,
        bitUpdatedAt,
      },
      content.id,
    )
  }
}
