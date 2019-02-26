import { Logger } from '@mcro/logger'
import {
  Bit,
  BitEntity,
  CosalTopWordsModel,
  GithubSource,
  SlackBitData,
  Source,
} from '@mcro/models'
import { GithubIssue, GithubPullRequest } from '@mcro/services'
import { hash, sleep } from '@mcro/utils'
import { chunk } from 'lodash'
import { getManager } from 'typeorm'
import { Mediator } from '../mediator'
import { checkCancelled } from '../resolvers/SourceForceCancelResolver'

/**
 * Sync Bits options.
 */
export interface BitSyncerOptions {
  apiBits: Bit[]
  dbBits: Bit[]
}

/**
 * Syncs Bits.
 */
export class BitSyncer {
  private source: Source
  private log: Logger

  constructor(source: Source | undefined, log: Logger) {
    this.source = source
    this.log = log
  }

  /**
   * Creates a bit id.
   */
  static buildId(source: GithubSource, data: GithubIssue | GithubPullRequest)
  static buildId(source: Source, data: any) {
    if (source.type === 'github') {
      return hash(`${source.type}-${source.id}-${data}`)
    }
  }

  /**
   * Syncs given bits in the database.
   */
  async sync(options: BitSyncerOptions) {
    this.log.info('syncing bits', options)
    const { apiBits, dbBits } = options

    // calculate bits that we need to update in the database
    let insertedBits = apiBits.filter(apiBit => {
      return !dbBits.some(dbBit => dbBit.id === apiBit.id)
    })
    const updatedBits = apiBits.filter(apiBit => {
      const dbBit = dbBits.find(dbBit => dbBit.id === apiBit.id)
      return dbBit && dbBit.contentHash !== apiBit.contentHash
    })
    const removedBits = dbBits.filter(dbBit => {
      return !apiBits.some(apiBit => apiBit.id === dbBit.id)
    })

    // from inserted bits we filter out bits with same content hash
    const duplicateInsertBits = insertedBits.filter(bit => {
      return insertedBits.filter(b => b.contentHash === bit.contentHash).length > 1
    })
    insertedBits = insertedBits.filter(bit => {
      return insertedBits.filter(b => b.contentHash === bit.contentHash).length === 1
    })

    // perform database operations on synced bits
    if (!insertedBits.length && !updatedBits.length && !removedBits.length) {
      this.log.info('no changes were detected, no bits were synced')
      return
    }

    // there is one problematic use case - if user removes Source during synchronization
    // we should not sync anything (shouldn't write any new person or bit into the database)
    // that's why we check if we have job for this particular source registered
    // and we do it twice - before saving anything to prevent further operations
    // and after saving everything to make sure source wasn't removed or requested for removal
    // while we were inserting new bits
    // if (await this.syncerRepository.isSettingRemoved()) {
    //   this.log.warning('found a source in a process of removal, skip syncing')
    //   return
    // }

    this.log.timer('save bits in the database', {
      insertedBits,
      updatedBits,
      removedBits,
      duplicateInsertBits,
    })
    try {
      await getManager().transaction(async manager => {
        // insert new bits
        if (insertedBits.length > 0) {
          const insertedBitChunks = chunk(insertedBits, 50)
          for (let bits of insertedBitChunks) {
            if (this.source) {
              await checkCancelled(this.source.id)
            }
            await this.completeBitsData(bits)
            await manager.insert(BitEntity, bits)
            // Add some small throttle
            await sleep(20)
          }
          for (let bit of insertedBits) {
            await manager
              .createQueryBuilder(BitEntity, 'bit')
              .relation('people')
              .of(bit)
              .add(bit.people)
          }
        }

        // update changed bits
        await this.completeBitsData(updatedBits)
        for (let bit of updatedBits) {
          if (this.source) {
            await checkCancelled(this.source.id)
          }
          await manager.update(BitEntity, { id: bit.id }, bit)

          const dbPeople = await manager.getRepository(BitEntity).find({
            // TODO @umed type complains for me
            // @ts-ignore
            select: {
              id: true,
            },
            where: {
              type: 'person',
              bits: {
                id: bit.id,
              },
            },
          })

          const newPeople = bit.people.filter(person => {
            return !dbPeople.some(dbPerson => dbPerson.id === person.id)
          })
          const removedPeople = dbPeople.filter(dbPerson => {
            return !bit.people.some(person => person.id === dbPerson.id)
          })

          if (newPeople.length || removedPeople.length) {
            this.log.info('found people changes in a bit', bit, { newPeople, removedPeople })

            await manager
              .createQueryBuilder(BitEntity, 'bit')
              .relation('people')
              .of(bit)
              .addAndRemove(newPeople, removedPeople)
          }
        }

        // delete removed bits
        if (removedBits.length > 0) {
          await manager.delete(BitEntity, removedBits)
        }

        // before committing transaction we make sure nobody removed source during period of save
        // we use non-transactional manager inside this method intentionally
        // if (await this.syncerRepository.isSettingRemoved()) throw 'source removed'
      })
      this.log.timer('save bits in the database')
    } catch (error) {
      // if (error === 'source removed') {
      //   this.log.warning('found a source in a process of removal, skip syncing')
      //   return
      // }
      throw error
    }
  }

  private async completeBitsData(bits: Bit[]) {
    for (let bit of bits) {
      if (bit.sourceType === 'slack' && bit.type === 'conversation') {
        const flatBody = (bit.data as SlackBitData).messages.map(x => x.text).join(' ')
        bit.title = (await Mediator.loadMany(CosalTopWordsModel, {
          args: { text: flatBody, max: 6 },
        })).join(' ')
      }
    }
  }
}
