import { createWorker } from '@o/worker-kit'

import { DriveBitFactory } from './DriveBitFactory'
import { DriveLoader } from './DriveLoader'
import { DriveAppData } from './DriveModels'

/**
 * Syncs Google Drive files.
 */
export const DriveSyncer = createWorker(async ({ app, log, utils }) => {
  const factory = new DriveBitFactory(utils)
  const loader = new DriveLoader(app, log, () => utils.updateAppData())

  const appData: DriveAppData = app.data
  if (!appData.values.lastSync) appData.values.lastSync = {}
  const lastSync = appData.values.lastSync

  // load users from API
  await loader.loadFiles(async (file, cursor, isLast) => {
    await utils.isAborted()

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
      await utils.updateAppData()

      return false // this tells from the callback to stop file proceeding
    }

    // for the first ever synced file we store its updated date, and once sync is done,
    // next time we make sync again we don't want to sync files less then this date
    if (!lastSync.lastCursorSyncedDate) {
      lastSync.lastCursorSyncedDate = updatedAt
      log.info('looks like its the first syncing file, set last synced date', lastSync)
      await utils.updateAppData()
    }

    const bit = factory.createDocumentBit(file)
    bit.people = file.users.map(user => factory.createPersonBit(user))

    await utils.saveBits(bit.people)
    await utils.saveBit(bit)

    // in the case if its the last issue we need to cleanup last cursor stuff and save last synced date
    if (isLast) {
      log.info(
        'looks like its the last issue in this sync, removing last cursor and source last sync date',
        lastSync,
      )
      lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
      lastSync.lastCursor = undefined
      lastSync.lastCursorSyncedDate = undefined
      await utils.updateAppData()
      return true
    }

    // update last sync settings to make sure we continue from the last point in the case if application will stop
    if (lastSync.lastCursor !== cursor) {
      log.verbose('updating last cursor in settings', { cursor })
      lastSync.lastCursor = cursor
      await utils.updateAppData()
    }

    return true
  })
})
