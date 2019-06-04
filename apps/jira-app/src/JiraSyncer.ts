import { createWorker } from '@o/worker-kit'

import { JiraBitFactory } from './JiraBitFactory'
import { JiraLoader } from './JiraLoader'
import { JiraAppData } from './JiraModels'

/**
 * Syncs Jira issues.
 */
export const JiraSyncer = createWorker(async ({ app, log, utils }) => {
  const factory = new JiraBitFactory(app, utils)
  const loader = new JiraLoader(app, log)
  const appData: JiraAppData = app.data

  // setup initial app data properties
  if (!appData.values.lastSync) appData.values.lastSync = {}
  const lastSync = appData.values.lastSync

  // load users from jira API and create person bits for them
  const apiUsers = await loader.loadUsers()
  const apiPeople = apiUsers.map(user => factory.createPersonBit(user))
  log.info('bits for api users created', apiPeople)

  // load database people and execute sync. once sync is complete we must re-load people
  const dbPeople = await utils.loadBits({ type: 'person' })
  await utils.syncBits(apiPeople, dbPeople)
  const allDbPeople = await utils.loadBits({ type: 'person' })

  // load issues from API in a stream
  await loader.loadIssues(
    lastSync.lastCursor || 0,
    lastSync.lastCursorLoadedCount || 0,
    async (issue, cursor, loadedCount, isLast) => {
      await utils.isAborted()

      const updatedAt = new Date(issue.fields.updated).getTime()

      // if we have synced stuff previously already, we need to prevent same issues syncing
      // check if issue's updated date is newer than our last synced date
      if (lastSync.lastSyncedDate && updatedAt <= lastSync.lastSyncedDate) {
        log.info('reached last synced date, stop syncing...', { issue, updatedAt, lastSync })

        // if its actually older we don't need to sync this issue and all next ones (since they are sorted by updated date)
        if (lastSync.lastCursorSyncedDate) {
          // important check, because we can be in this block without loading by cursor
          lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
        }
        lastSync.lastCursor = undefined
        lastSync.lastCursorSyncedDate = undefined
        await utils.updateAppData()

        return false // this tells from the callback to stop file proceeding
      }

      // for the first ever synced issue we store its updated date, and once sync is done,
      // next time we make sync again we don't want to sync issues less then this date
      if (!lastSync.lastCursorSyncedDate) {
        lastSync.lastCursorSyncedDate = updatedAt
        log.info('looks like its the first syncing issue, set last synced date', lastSync)
        await utils.updateAppData()
      }

      const bit = factory.createDocumentBit(issue, allDbPeople)
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
        lastSync.lastCursorLoadedCount = loadedCount
        await utils.updateAppData()
      }

      return true
    },
  )
})
