import { BitEntity, PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit, Setting } from '@mcro/models'
import { chunk } from 'lodash'
import { getManager } from 'typeorm'
import { SyncerQueries } from './SyncerQueries'

/**
 * Sync Bits options.
 */
export interface BitSyncerOptions {
  setting: Setting
  log: Logger
  apiBits: Bit[]
  dbBits: Bit[]
}

/**
 * Syncs Bits.
 */
export class BitSyncer {

  constructor(private options: BitSyncerOptions) {
  }

  /**
   * Syncs given bits in the database.
   */
  async sync() {
    let { log, apiBits, dbBits } = this.options
    log.info(`syncing bits`, this.options)

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

    // perform database operations on synced bits
    if (!insertedBits.length && !updatedBits.length && !removedBits.length) {
      log.verbose(`no changes were detected, nothing was synced`)
      return
    }

    // there is one problematic use case - if user removes integration during synchronization
    // we should not sync anything (shouldn't write any new person or bit into the database)
    // that's why we check if we have job for this particular setting registered
    // and we do it twice - before saving anything to prevent further operations
    // and after saving everything to make sure setting wasn't removed or requested for removal
    // while we were inserting new bits
    if (await SyncerQueries.isSettingRemoved(this.options.setting.id)) {
      log.warning(`found a setting in a process of removal, skip syncing`)
      return
    }

    log.timer(`save bits in the database`, { insertedBits, updatedBits, removedBits })
    try {
      await getManager().transaction(async manager => {

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
            log.verbose(`found people changes in a bit`, bit, { newPeople, removedPeople })

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
        if (await SyncerQueries.isSettingRemoved(this.options.setting.id))
          throw "setting removed"

      })
      log.timer(`save bits in the database`)

    } catch (error) {
      if (error === "setting removed") {
        log.warning(`found a setting in a process of removal, skip syncing`)
        return
      }
      throw error
    }
  }

}
