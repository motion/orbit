import { Logger } from '@mcro/logger'
import { AppBitEntity, Bit, BitEntity, BitUtils, DriveApp, DriveBitData } from '@mcro/models'
import { DriveLoadedFile, DriveLoader, DriveUser } from '@mcro/services'
import { sleep } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { AppSyncer } from '../../core/AppSyncer'
import { checkCancelled } from '../../resolvers/AppForceCancelResolver'

/**
 * Syncs Google Drive files.
 */
export class DriveSyncer implements AppSyncer {
  private app: DriveApp
  private log: Logger
  private loader: DriveLoader

  constructor(source: DriveApp, log?: Logger) {
    this.app = source
    this.log = log || new Logger('syncer:drive:' + source.id)
    this.loader = new DriveLoader(this.app, this.log, source =>
      getRepository(AppBitEntity).save(source),
    )
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    if (!this.app.data.values.lastSync) this.app.data.values.lastSync = {}
    const lastSync = this.app.data.values.lastSync

    // load users from API
    this.log.timer('load files and people from API')
    const files = await this.loader.loadFiles(undefined, async (file, cursor, isLast) => {
      await checkCancelled(this.app.id)
      await sleep(2)

      const updatedAt = new Date(file.file.modifiedByMeTime || file.file.modifiedTime).getTime()

      // if we have synced stuff previously already, we need to prevent same files syncing
      // check if file's updated date is newer than our last synced date
      if (lastSync.lastSyncedDate && updatedAt <= lastSync.lastSyncedDate) {
        this.log.info('reached last synced date, stop syncing...', { file, updatedAt, lastSync })

        // if its actually older we don't need to sync this file and all next ones (since they are sorted by updated date)
        if (lastSync.lastCursorSyncedDate) {
          // important check, because we can be in this block without loading by cursor
          lastSync.lastSyncedDate = lastSync.lastCursorSyncedDate
        }
        lastSync.lastCursor = undefined
        lastSync.lastCursorSyncedDate = undefined
        await getRepository(AppBitEntity).save(this.app)

        return false // this tells from the callback to stop file proceeding
      }

      // for the first ever synced file we store its updated date, and once sync is done,
      // next time we make sync again we don't want to sync files less then this date
      if (!lastSync.lastCursorSyncedDate) {
        lastSync.lastCursorSyncedDate = updatedAt
        this.log.info('looks like its the first syncing file, set last synced date', lastSync)
        await getRepository(AppBitEntity).save(this.app)
      }

      const bit = this.createDocumentBit(file)
      bit.people = file.users.map(user => this.createPersonBit(user))

      this.log.verbose('syncing', { file, bit, people: bit.people })
      await getRepository(BitEntity).save(bit.people, { listeners: false })
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
        await getRepository(AppBitEntity).save(this.app)
        return true
      }

      // update last sync settings to make sure we continue from the last point in the case if application will stop
      if (lastSync.lastCursor !== cursor) {
        this.log.info('updating last cursor in settings', { cursor })
        lastSync.lastCursor = cursor
        await getRepository(AppBitEntity).save(this.app)
      }

      return true
    })
    this.log.timer('load files and people from API', files)
  }

  /**
   * Creates person entity from a given Drive user.
   */
  private createPersonBit(user: DriveUser): Bit {
    return BitUtils.create(
      {
        appType: 'drive',
        appId: this.app.id,
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
  private createDocumentBit(file: DriveLoadedFile): Bit {
    return BitUtils.create(
      {
        appType: 'drive',
        appId: this.app.id,
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
}
