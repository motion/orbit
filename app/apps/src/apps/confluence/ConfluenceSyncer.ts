import { AppEntity, Bit, BitEntity } from '@mcro/models'
import { ConfluenceContent, ConfluenceLoader, ConfluenceUser } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { BitUtils, createSyncer } from '@mcro/sync-kit'
import { ConfluenceLastSyncInfo } from './ConfluenceAppData'
import { ConfluenceBitData } from './ConfluenceBitData'

/**
 * Syncs Confluence pages and blogs.
 */
export const ConfluenceSyncer = createSyncer(async ({ app, log, manager, utils, isAborted }) => {

  const loader = new ConfluenceLoader(app, log)

  /**
   * Handles a content (blog or page) from loaded confluence content stream.
   */
  const handleContent = async (options: {
    lastSyncInfo: ConfluenceLastSyncInfo
    content: ConfluenceContent
    cursor: number
    loadedCount: number
    isLast: boolean
    allDbPeople: Bit[]
  }) => {
    await isAborted()
    await sleep(2)

    const { lastSyncInfo, content, cursor, loadedCount, isLast, allDbPeople } = options
    const updatedAt = new Date(content.history.lastUpdated.when).getTime()

    // if we have synced stuff previously already, we need to prevent same content syncing
    // check if content's updated date is newer than our last synced date
    if (lastSyncInfo.lastSyncedDate && updatedAt <= lastSyncInfo.lastSyncedDate) {
      log.info('reached last synced date, stop syncing...', {
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
      await manager.getRepository(AppEntity).save(app)

      return false // this tells from the callback to stop file proceeding
    }

    // for the first ever synced content we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync content less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      log.info('looks like its the first syncing content, set last synced date', lastSyncInfo)
      await manager.getRepository(AppEntity).save(app)
    }

    const bit = createDocumentBit(content, allDbPeople)
    log.verbose('syncing', { content, bit, people: bit.people })
    await manager.getRepository(BitEntity).save(bit, { listeners: false })

    // in the case if its the last content we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      log.info(
        'looks like its the last content in this sync, removing last cursor and app last sync date',
        lastSyncInfo,
      )
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      await manager.getRepository(AppEntity).save(app)
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      log.info('updating last cursor in settings', { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await manager.getRepository(AppEntity).save(app)
    }

    return true
  }

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  const checkUser  = (user: ConfluenceUser): boolean => {
    const email = user.details.personal.email || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

  /**
   * Creates person entity from a given Confluence user.
   */
  const createPersonBit = (user: ConfluenceUser): Bit => {
    const values = app.data.values

    // create or update a bit
    return BitUtils.create(
      {
        appIdentifier: 'confluence',
        appId: app.id,
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
  const createDocumentBit = (content: ConfluenceContent, allPeople: Bit[]): Bit => {
    const values = app.data.values
    const domain = values.credentials.domain
    const bitCreatedAt = new Date(content.history.createdDate).getTime()
    const bitUpdatedAt = new Date(content.history.lastUpdated.when).getTime()
    const body = utils.stripHtml(content.body.styled_view.value)
    let cleanHtml = utils.sanitizeHtml(content.body.styled_view.value)
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
        appIdentifier: 'confluence',
        appId: app.id,
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

  if (!app.data.values.pageLastSync) app.data.values.pageLastSync = {}
  const pageLastSync = app.data.values.pageLastSync
  if (!app.data.values.blogLastSync) app.data.values.blogLastSync = {}
  const blogLastSync = app.data.values.blogLastSync

  // load database data
  log.timer('load person bits from the database')
  const dbPeople = await utils.loadDatabasePeople()
  log.timer('load person bits and bits from the database', { dbPeople })

  // load users from confluence API
  log.info('loading confluence API users')
  const allUsers = await loader.loadUsers()
  log.info('got confluence API users', allUsers)

  // we don't need some confluence users, like system or bot users
  // so we are filtering them out
  log.info("filter out users we don't need")
  const filteredUsers = allUsers.filter(member => checkUser(member))
  log.info('updated users after filtering', filteredUsers)

  // create people for loaded user
  log.info('creating people for api users')
  const apiPeople = filteredUsers.map(user => createPersonBit(user))
  log.info('people created', apiPeople)

  // saving people and person bits
  await utils.syncPeople(apiPeople, dbPeople)

  // reload database people again
  const allDbPeople = await utils.loadDatabasePeople()

  // sync content - pages
  log.timer('sync API pages')
  await loader.loadContents(
    'page',
    pageLastSync.lastCursor || 0,
    pageLastSync.lastCursorLoadedCount || 0,
    (content, cursor, loadedCount, isLast) => {
      return handleContent({
        content,
        cursor,
        loadedCount,
        isLast,
        lastSyncInfo: pageLastSync,
        allDbPeople,
      })
    },
  )
  log.timer('sync API pages')

  // sync content - blogs
  log.timer('sync API blogs')
  await loader.loadContents(
    'blogpost',
    blogLastSync.lastCursor || 0,
    blogLastSync.lastCursorLoadedCount || 0,
    (content, cursor, loadedCount, isLast) => {
      return handleContent({
        content,
        cursor,
        loadedCount,
        isLast,
        lastSyncInfo: blogLastSync,
        allDbPeople,
      })
    },
  )
  log.timer('sync API blogs')

})

