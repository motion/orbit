import { Bit } from '@mcro/models'
import { createSyncer } from '@mcro/sync-kit'
import { ConfluenceAppData, ConfluenceLastSyncInfo } from './ConfluenceAppData'
import { ConfluenceContent } from './ConfluenceTypes'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceBitFactory } from './ConfluenceBitFactory'

/**
 * Syncs Confluence pages and blogs.
 */
export const ConfluenceSyncer = createSyncer(async ({ app, log, utils }) => {

  const factory = new ConfluenceBitFactory(app)
  const loader = new ConfluenceLoader(app, log)
  const appData: ConfluenceAppData = app.data

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
    await utils.isAborted()

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
      await utils.updateAppData()

      return false // this tells from the callback to stop file proceeding
    }

    // for the first ever synced content we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync content less then this date
    if (!lastSyncInfo.lastCursorSyncedDate) {
      lastSyncInfo.lastCursorSyncedDate = updatedAt
      log.info('looks like its the first syncing content, set last synced date', lastSyncInfo)
      await utils.updateAppData()
    }

    const bit = factory.createDocumentBit(content, allDbPeople)
    await utils.saveBit(bit)

    // in the case if its the last content we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      log.info(
        'looks like its the last content in this sync, removing last cursor and app last sync date',
        lastSyncInfo,
      )
      lastSyncInfo.lastSyncedDate = lastSyncInfo.lastCursorSyncedDate
      lastSyncInfo.lastCursor = undefined
      lastSyncInfo.lastCursorSyncedDate = undefined
      await utils.updateAppData()
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSyncInfo.lastCursor !== cursor) {
      log.info('updating last cursor in settings', { cursor })
      lastSyncInfo.lastCursor = cursor
      lastSyncInfo.lastCursorLoadedCount = loadedCount
      await utils.updateAppData()
   }

    return true
  }

  if (!appData.values.pageLastSync) appData.values.pageLastSync = {}
  const pageLastSync = appData.values.pageLastSync
  if (!appData.values.blogLastSync) appData.values.blogLastSync = {}
  const blogLastSync = appData.values.blogLastSync

  // load database data
  const dbPeople = await utils.loadDatabasePeople()

  // load users from confluence API
  const allUsers = await loader.loadUsers()

  // create people for loaded user
  const apiPeople = allUsers.map(user => factory.createPersonBit(user))
  log.info('people created', apiPeople)

  // saving people and person bits
  await utils.syncPeople(apiPeople, dbPeople)

  // reload database people again
  const allDbPeople = await utils.loadDatabasePeople()

  // sync content - pages
  await loader.loadContents(
    'page',
    pageLastSync.lastCursor || 0,
    pageLastSync.lastCursorLoadedCount || 0,
    (content, cursor, loadedCount, isLast) => handleContent({
      content,
      cursor,
      loadedCount,
      isLast,
      lastSyncInfo: pageLastSync,
      allDbPeople,
    })
  )

  // sync content - blogs
  await loader.loadContents(
    'blogpost',
    blogLastSync.lastCursor || 0,
    blogLastSync.lastCursorLoadedCount || 0,
    (content, cursor, loadedCount, isLast) => handleContent({
      content,
      cursor,
      loadedCount,
      isLast,
      lastSyncInfo: blogLastSync,
      allDbPeople,
    })
  )

})
