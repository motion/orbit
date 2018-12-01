import { BitEntity, PersonBitEntity, PersonEntity, SourceEntity } from '@mcro/models'
import { Logger } from '@mcro/logger'
import { PersonBitUtils } from '@mcro/models'
import { DriveSource } from '@mcro/models'
import { DriveLoader } from '@mcro/services'
import { hash } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { DriveBitFactory } from './DriveBitFactory'
import { DrivePersonFactory } from './DrivePersonFactory'

/**
 * Syncs Google Drive files.
 */
export class DriveSyncer implements IntegrationSyncer {
  private source: DriveSource
  private log: Logger
  private loader: DriveLoader
  private bitFactory: DriveBitFactory
  private personFactory: DrivePersonFactory

  constructor(source: DriveSource, log?: Logger) {
    this.source = source
    this.log = log || new Logger('syncer:drive:' + source.id)
    this.loader = new DriveLoader(this.source, this.log, source =>
      getRepository(SourceEntity).save(source),
    )
    this.bitFactory = new DriveBitFactory(source)
    this.personFactory = new DrivePersonFactory(source)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    if (!this.source.values.lastSync) this.source.values.lastSync = {}
    const lastSync = this.source.values.lastSync

    // load users from API
    this.log.timer('load files and people from API')
    const files = await this.loader.loadFiles(undefined, async (file, cursor, isLast) => {
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
        await getRepository(SourceEntity).save(this.source)

        return false // this tells from the callback to stop file proceeding
      }

      // for the first ever synced file we store its updated date, and once sync is done,
      // next time we make sync again we don't want to sync files less then this date
      if (!lastSync.lastCursorSyncedDate) {
        lastSync.lastCursorSyncedDate = updatedAt
        this.log.info('looks like its the first syncing file, set last synced date', lastSync)
        await getRepository(SourceEntity).save(this.source)
      }

      const bit = this.bitFactory.create(file)
      bit.people = file.users.map(user => this.personFactory.create(user))

      // for people without emails we create "virtual" email
      for (let person of bit.people) {
        if (!person.email) {
          person.email = person.name + ' from ' + person.integration
        }
      }

      // find person bit with email
      const personBits = await Promise.all(
        bit.people.map(async person => {
          const dbPersonBit = await getRepository(PersonBitEntity).findOne(hash(person.email))
          const newPersonBit = PersonBitUtils.createFromPerson(person)
          const personBit = PersonBitUtils.merge(newPersonBit, dbPersonBit || {})

          // push person to person bit's people
          const hasPerson = personBit.people.some(existPerson => existPerson.id === person.id)
          if (!hasPerson) {
            personBit.people.push(person)
          }

          return personBit
        }),
      )

      this.log.verbose('syncing', { file, bit, people: bit.people, personBits })
      await getRepository(PersonEntity).save(bit.people, { listeners: false })
      await getRepository(PersonBitEntity).save(personBits, { listeners: false })
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
        await getRepository(SourceEntity).save(this.source)
      }

      return true
    })
    this.log.timer('load files and people from API', files)
  }
}
