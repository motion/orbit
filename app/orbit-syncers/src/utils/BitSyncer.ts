import { BitEntity, PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit, Setting } from '@mcro/models'
import { chunk } from 'lodash'
import { getManager } from 'typeorm'
import { SyncerRepository } from './SyncerRepository'

/**
 * Sync Bits options.
 */
export interface BitSyncerOptions {
  apiBits: Bit[]
  dbBits: Bit[]
  removedBits?: Bit[]
  dropAllBits?: boolean
}

/**
 * Syncs Bits.
 */
export class BitSyncer {
  private setting: Setting
  private log: Logger
  private syncerRepository: SyncerRepository

  constructor(setting: Setting, log: Logger) {
    this.setting = setting
    this.log = log
    this.syncerRepository = new SyncerRepository(setting)
  }

  /**
   * Syncs given bits in the database.
   */
  async sync(options: BitSyncerOptions) {
    this.log.info(`syncing bits`, options)
    const { apiBits, dbBits } = options

    // calculate bits that we need to update in the database
    const insertedBits = apiBits.filter(apiBit => {
      return !dbBits.some(dbBit => dbBit.id === apiBit.id)
    })
    const updatedBits = apiBits.filter(apiBit => {
      const dbBit = dbBits.find(dbBit => dbBit.id === apiBit.id)
      return dbBit && dbBit.contentHash !== apiBit.contentHash
    })
    const removedBits = dbBits.filter(dbBit => {
      return !apiBits.some(apiBit => apiBit.id === dbBit.id)
    })

    // if we have explicitly removed bits set, add them to removing bits
    if (options.removedBits)
      removedBits.push(...options.removedBits)

    // perform database operations on synced bits
    if (!insertedBits.length && !updatedBits.length && !removedBits.length) {
      this.log.info(`no changes were detected, no bits were synced`)
      return
    }

    // there is one problematic use case - if user removes integration during synchronization
    // we should not sync anything (shouldn't write any new person or bit into the database)
    // that's why we check if we have job for this particular setting registered
    // and we do it twice - before saving anything to prevent further operations
    // and after saving everything to make sure setting wasn't removed or requested for removal
    // while we were inserting new bits
    if (await this.syncerRepository.isSettingRemoved()) {
      this.log.warning(`found a setting in a process of removal, skip syncing`)
      return
    }

    this.log.timer(`save bits in the database`, { insertedBits, updatedBits, removedBits })
    try {
      await getManager().transaction(async manager => {

        // drop all exist bits if such option was specified
        if (options.dropAllBits)
          await manager.delete(BitEntity, { settingId: this.setting.id })

        // insert new bits
        if (insertedBits.length > 0) {
          const insertedBitChunks = chunk(insertedBits, 50)
          for (let bits of insertedBitChunks) {
            await manager.insert(BitEntity, bits)
          }
          for (let bit of insertedBits) {
            await manager
              .createQueryBuilder(BitEntity, "bit")
              .relation("people")
              .of(bit)
              .add(bit.people)
          }
        }

        // update changed bits
        for (let bit of updatedBits) {
          await manager.update(BitEntity, { id: bit.id }, bit)

          const dbPeople = await manager
            .getRepository(PersonEntity)
            .find({
              select: {
                id: true
              },
              where: {
                bits: {
                  id: bit.id
                }
              }
            })

          const newPeople = bit.people.filter(person => {
            return !dbPeople.some(dbPerson => dbPerson.id === person.id)
          })
          const removedPeople = dbPeople.filter(dbPerson => {
            return !bit.people.some(person => person.id === dbPerson.id)
          })

          if (newPeople.length || removedPeople.length) {
            this.log.info(`found people changes in a bit`, bit, { newPeople, removedPeople })

            await manager
              .createQueryBuilder(BitEntity, "bit")
              .relation("people")
              .of(bit)
              .addAndRemove(newPeople, removedPeople)
          }
        }

        // delete removed bits
        if (removedBits.length > 0) {
          await manager.delete(BitEntity, removedBits)
        }

        // before committing transaction we make sure nobody removed setting during period of save
        // we use non-transactional manager inside this method intentionally
        if (await this.syncerRepository.isSettingRemoved())
          throw "setting removed"

      })
      this.log.timer(`save bits in the database`)

    } catch (error) {
      if (error === "setting removed") {
        this.log.warning(`found a setting in a process of removal, skip syncing`)
        return
      }
      throw error
    }
  }

}
