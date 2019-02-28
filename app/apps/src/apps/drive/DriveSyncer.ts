import { AppEntity, Bit, BitEntity } from '@mcro/models'
import { DriveLoadedFile, DriveLoader, DriveUser } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { BitUtils, createSyncer } from '@mcro/sync-kit'
import { DriveBitData } from './DriveBitData'

/**
 * Syncs Google Drive files.
 */
export const DriveSyncer = createSyncer(async ({ app, log, manager, isAborted }) => {

  const loader = new DriveLoader(app, log, source =>
    manager.getRepository(AppEntity).save(source),
  )

  /**
   * Creates person entity from a given Drive user.
   */
  const createPersonBit = (user: DriveUser): Bit => {
    return BitUtils.create(
      {
        appIdentifier: 'drive',
        appId: app.id,
        type: 'person',
        originalId: user.emailAddress,
        title: user.displayName,
        email: user.emailAddress,
        photo: user.photoLink,
      },
      user.emailAddress,
    )
  }

  /**
   * Builds a document bit from the given google drive aggregated file.
   */
  const createDocumentBit = (file: DriveLoadedFile): Bit => {
    return BitUtils.create(
      {
        appIdentifier: 'drive',
        appId: app.id,
        type: 'document',
        title: file.file.name,
        body: file.content || 'empty',
        data: {} as DriveBitData,
        webLink: file.file.webViewLink ? file.file.webViewLink : file.file.webContentLink,
        location: file.parent
          ? {
            id: file.parent.id,
            name: file.parent.name,
            webLink: file.file.webViewLink || file.parent.webContentLink,
            desktopLink: '',
          }
          : undefined,
        bitCreatedAt: new Date(file.file.createdTime).getTime(),
        bitUpdatedAt: new Date(file.file.modifiedTime).getTime(),
        // image:
        //   file.file.fileExtension && file.file.thumbnailLink
        //     ? file.file.id + '.' + file.file.fileExtension
        //     : undefined,
      },
      file.file.id,
    )
  }

  if (!app.data.values.lastSync) app.data.values.lastSync = {}
  const lastSync = app.data.values.lastSync

  // load users from API
  log.timer('load files and people from API')
  const files = await loader.loadFiles(undefined, async (file, cursor, isLast) => {
    await isAborted()
    await sleep(2)

    const updatedAt = new Date(file.file.modifiedByMeTime || file.file.modifiedTime).getTime()

    // if we have synced stuff previously already, we need to prevent same files syncing
    // check if file's updated date is newer than our last synced date
    if (lastSync.lastSyncedDate && updatedAt <= lastSync.lastSyncedDate) {
      log.info('reached last synced date, stop syncing...', { file, updatedAt, lastSync })

      // if its actually older we don't need to sync this file and all next ones (since they are sorted by updated date)
      if (lastSync.lastCursorSyncedDate) {
        // important check, because we can be in this block without loading by cursor
        lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
      }
      lastSync.lastCursor = undefined
      lastSync.lastCursorSyncedDate = undefined
      await manager.getRepository(AppEntity).save(app)

      return false // this tells from the callback to stop file proceeding
    }

    // for the first ever synced file we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync files less then this date
    if (!lastSync.lastCursorSyncedDate) {
      lastSync.lastCursorSyncedDate = updatedAt
      log.info('looks like its the first syncing file, set last synced date', lastSync)
      await manager.getRepository(AppEntity).save(app)
    }

    const bit = createDocumentBit(file)
    bit.people = file.users.map(user => createPersonBit(user))

    log.verbose('syncing', { file, bit, people: bit.people })
    await manager.getRepository(BitEntity).save(bit.people, { listeners: false })
    await manager.getRepository(BitEntity).save(bit, { listeners: false })

    // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      log.info(
        'looks like its the last issue in this sync, removing last cursor and source last sync date',
        lastSync,
      )
      lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
      lastSync.lastCursor = undefined
      lastSync.lastCursorSyncedDate = undefined
      await manager.getRepository(AppEntity).save(app)
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSync.lastCursor !== cursor) {
      log.info('updating last cursor in settings', { cursor })
      lastSync.lastCursor = cursor
      await manager.getRepository(AppEntity).save(app)
    }

    return true
  })
  log.timer('load files and people from API', files)

})
