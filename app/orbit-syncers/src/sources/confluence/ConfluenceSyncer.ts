import { BitEntity, SourceEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { ConfluenceLastSyncInfo, ConfluenceSource, Person } from '@mcro/models'
import { ConfluenceContent, ConfluenceLoader, ConfluenceUser } from '@mcro/services'
import { getRepository } from 'typeorm'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { ConfluenceBitFactory } from './ConfluenceBitFactory'
import { ConfluencePersonFactory } from './ConfluencePersonFactory'

/**
 * Syncs Confluence pages and blogs.
 */
export class ConfluenceSyncer {
  private log: Logger
  private source: ConfluenceSource
  private loader: ConfluenceLoader
  private bitFactory: ConfluenceBitFactory
  private personFactory: ConfluencePersonFactory
  private personSyncer: PersonSyncer
  private syncerRepository: SyncerRepository

  constructor(source: ConfluenceSource, log?: Logger) {
    this.log = log || new Logger('syncer:confluence:' + source.id)
    this.source = source
    this.loader = new ConfluenceLoader(source, this.log)
    this.bitFactory = new ConfluenceBitFactory(source)
    this.personFactory = new ConfluencePersonFactory(source)
    this.personSyncer = new PersonSyncer(this.log)
    this.syncerRepository = new SyncerRepository(source)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    if (!this.source.values.pageLastSync) this.source.values.pageLastSync = {}
    const pageLastSync = this.source.values.pageLastSync
    if (!this.source.values.blogLastSync) this.source.values.blogLastSync = {}
    const blogLastSync = this.source.values.blogLastSync

    // load database data
    this.log.timer('load people, person bits and bits from the database')
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
    const dbPersonBits = await this.syncerRepository.loadDatabasePersonBits({ people: dbPeople })
    this.log.timer('load people, person bits and bits from the database', {
      dbPeople,
      dbPersonBits,
    })

    // load users from confluence API
    this.log.info('loading confluence API users')
    const allUsers = await this.loader.loadUsers()
    this.log.info('got confluence API users', allUsers)

    // we don't need some confluence users, like system or bot users
    // so we are filtering them out
    this.log.info('filter out users we don\'t need')
    const filteredUsers = allUsers.filter(member => this.checkUser(member))
    this.log.info('updated users after filtering', filteredUsers)

    // create people for loaded user
    this.log.info('creating people for api users')
    const apiPeople = filteredUsers.map(user => this.personFactory.create(user))
    this.log.info('people created', apiPeople)

    // saving people and person bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })

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
          allDbPeople
        })
      }
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
          allDbPeople
        })
      }
    )
    this.log.timer('sync API blogs')
  }

  /**
   * Handles a content (blog or page) from loaded confluence content stream.
   */
  private async handleContent(options: {
    lastSyncInfo: ConfluenceLastSyncInfo,
    content: ConfluenceContent,
    cursor: number,
    loadedCount: number,
    isLast: boolean,
    allDbPeople: Person[]
  }) {
    const { lastSyncInfo, content, cursor, loadedCount, isLast, allDbPeople } = options
    const updatedAt = new Date(content.history.lastUpdated.when).getTime()

    // if we have synced stuff previously already, we need to prevent same content syncing
    // check if content's updated date is newer than our last synced date
    if (lastSyncInfo.lastSyncedDate && updatedAt <= lastSyncInfo.lastSyncedDate) {
    this.log.verbose('reached last synced date, stop syncing...', { content, updatedAt, lastSync: lastSyncInfo })

    // if its actually older we don't need to sync this content and all next ones (since they are sorted by updated date)
    if (lastSyncInfo.lastCursorSyncedDate) {
      // important check, because we can be in this block without loading by cursor
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
    }
    lastSyncInfo.lastCursor = undefined
    lastSyncInfo.lastCursorSyncedDate = undefined
    await getRepository(SourceEntity).save(this.source)

    return false // this tells from the callback to stop file proceeding
    }

    // for the first ever synced content we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync content less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      this.log.verbose('looks like its the first syncing content, set last synced date', lastSyncInfo)
      await getRepository(SourceEntity).save(this.source)
    }

    const bit = this.bitFactory.create(content, allDbPeople)
    this.log.verbose('syncing', { content, bit, people: bit.people })
    await getRepository(BitEntity).save(bit, { listeners: false })

    // in the case if its the last content we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      this.log.verbose(
        'looks like its the last content in this sync, removing last cursor and source last sync date',
        lastSyncInfo,
      )
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      await getRepository(SourceEntity).save(this.source)
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      this.log.verbose('updating last cursor in settings', { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await getRepository(SourceEntity).save(this.source)
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
}
