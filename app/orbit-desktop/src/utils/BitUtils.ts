import { Logger } from '@mcro/logger'
import { Bit } from '@mcro/models'
import { chunk } from 'lodash'
import { getManager } from 'typeorm'
import { BitEntity } from '../entities/BitEntity'
import { PersonEntity } from '../entities/PersonEntity'
import { CommonUtils } from './CommonUtils'

/**
 * Bit-related utilities.
 */
export class BitUtils {

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

          const people = await manager
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
            return !people.some(dbPerson => dbPerson.id === person.id)
          })
          const removedPeople = people.filter(dbPerson => {
            return !bit.people.some(person => person.id === dbPerson.id)
          })

          await manager
            .createQueryBuilder(BitEntity, "bit")
            .relation("people")
            .of(bit)
            .addAndRemove(newPeople, removedPeople)
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
  static difference<T extends Bit>(firstBits: T[], secondBits: T[]): T[] {
    return firstBits.filter(firstBit => {
      return !secondBits.some(secondBit => {
        return firstBit.id === secondBit.id
      })
    })
  }

  /**
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Bit>) {
    const bit = Object.assign(new BitEntity(), properties)
    bit.contentHash = this.contentHash(bit)
    return bit
  }

  /**
   * Creates a content hash for a given bit.
   */
  private static contentHash(bit: Bit): number {
    return CommonUtils.hash([
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
