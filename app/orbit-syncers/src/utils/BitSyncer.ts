import { BitEntity, PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit } from '@mcro/models'
import { hash } from '@mcro/utils'
import { chunk } from 'lodash'
import { getManager } from 'typeorm'

/**
 * Syncs Bits.
 */
export class BitSyncer {

  /**
   * Syncs given bits in the database.
   */
  static async sync(log: Logger, apiBits: Bit[], dbBits: Bit[]) {
    log.verbose(`calculating inserted/updated/removed bits`, { apiBits, dbBits })

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
    if (insertedBits.length || updatedBits.length || removedBits.length) {
      log.timer(`save bits in the database`, { insertedBits, updatedBits, removedBits })
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
      })
      log.timer(`save bits in the database`)
    } else {
      log.verbose(`no changes were detected, nothing was synced`)
    }
  }

  /**
   * Returns missing elements of the first bits based on given list of second bits.
   */
  static difference<T extends Bit>(firstBits: T[], secondBits: T[]): T[] { // todo: this can be extracted into @mcro/model-utils
    return firstBits.filter(firstBit => {
      return !secondBits.some(secondBit => {
        return firstBit.id === secondBit.id
      })
    })
  }

  /**
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Bit>) {// todo: this can be extracted into @mcro/model-utils
    const bit = Object.assign(new BitEntity(), properties)
    bit.contentHash = this.contentHash(bit)
    return bit
  }

  /**
   * Creates a content hash for a given bit.
   */
  private static contentHash(bit: Bit): number { // todo: this can be extracted into @mcro/model-utils
    return hash([
      bit.id,
      bit.integration,
      bit.settingId,
      bit.title,
      bit.body,
      bit.type,
      bit.webLink,
      bit.desktopLink,
      bit.data,
      bit.location,
      bit.bitCreatedAt,
      bit.bitUpdatedAt,
      bit.authorId,
    ].filter(item => item !== null && item !== undefined))
  }

}
