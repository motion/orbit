import { In, MoreThan } from 'typeorm'
import { AppBit, Bit, BitEntity, CosalTopWordsModel } from '@mcro/models'
import { chunk, uniqBy } from 'lodash'
import { Logger } from '@mcro/logger'
import { sleep } from '@mcro/utils'
import { getEntityManager, getMediatorClient, isAborted } from './index'

const createDOMPurify = require('dompurify')
const JSDOM = require('jsdom').JSDOM

/**
 * Sync Bits options.
 */
export interface BitSyncerOptions {
  app: AppBit
  apiBits: Bit[]
  dbBits: Bit[]
  completeBitsData?: (bits: Bit[]) => void|Promise<void>
}

/**
 * Syncs given people in the database.
 * Returns saved (inserted and updated) people.
 */
export async function syncPeople(app: AppBit, apiPeople: Bit[], dbPeople: Bit[]): Promise<Bit[]> {
  const log = new Logger('syncer:' + app.identifier)

  log.info('syncing people and person bits', { apiPeople, dbPeople })

  // filter out duplicate people, left only unique people
  apiPeople = uniqBy(apiPeople, person => person.id)
  dbPeople = uniqBy(dbPeople, person => person.id)

  // calculate people that we need to update in the database
  log.timer('calculating people change set')
  const insertedPeople = apiPeople.filter(apiPerson => {
    return !dbPeople.some(dbPerson => dbPerson.id === apiPerson.id)
  })
  const updatedPeople = apiPeople.filter(apiPerson => {
    const dbPerson = dbPeople.find(dbPerson => dbPerson.id === apiPerson.id)
    return dbPerson && dbPerson.contentHash !== apiPerson.contentHash
  })
  const removedPeople = dbPeople.filter(dbPerson => {
    return !apiPeople.some(apiPerson => apiPerson.id === dbPerson.id)
  })
  log.timer('calculating people change set', {
    insertedPeople,
    updatedPeople,
    removedPeople,
  })

  // perform database operations on synced bits
  if (!insertedPeople.length && !updatedPeople.length && !removedPeople.length) {
    log.info('no changes were detected, people and person bits were not synced')
    return
  }

  // there is one problematic use case - if user removes Source during synchronization
  // we should not sync anything (shouldn't write any new person or bit into the database)
  // that's why we check if we have job for this particular setting registered
  // and we do it twice - before saving anything to prevent further operations
  // and after saving everything to make sure setting wasn't removed or requested for removal
  // while we were inserting new bits
  // if (await this.syncerRepository.isSettingRemoved()) {
  //   log.warning(`found a setting in a process of removal, skip syncing`)
  //   return
  // }

  log.timer('save people and person bits in the database')
  await getEntityManager().transaction(async manager => {
    await manager.save(BitEntity, insertedPeople, { chunk: 100 })
    await manager.save(BitEntity, updatedPeople, { chunk: 100 })
    await manager.remove(BitEntity, removedPeople as any, { chunk: 100 })
  })
  log.timer('save people and person bits in the database')
}

/**
 * Loads bits in a given period.
 */
export async function loadDatabaseBits(app: AppBit, options?: {
  ids?: number[]
  locationId?: string
  oldestMessageId?: string
}): Promise<Bit[]> {
  if (!options) options = {}
  return getEntityManager().getRepository(BitEntity).find({
    select: {
      id: true,
      contentHash: true,
    },
    where: {
      id: options.ids ? In(options.ids) : undefined,
      appId: app.id,
      location: {
        id: options.locationId ? options.locationId : undefined,
      },
      bitCreatedAt: options.oldestMessageId
        ? MoreThan(parseInt(options.oldestMessageId) * 1000)
        : undefined,
    },
  })
}

/**
 * Loads all exist database people for the current App.
 */
export async function loadDatabasePeople(app: AppBit, options?: { ids?: number[] }): Promise<Bit[]> {
  if (!options) options = {}
  return getEntityManager().getRepository(BitEntity).find({
    where: {
      id: options.ids ? In(options.ids) : undefined,
      type: 'person',
      appId: app.id,
    },
  })
}

/**
 * Strips HTML from the given HTML text content.
 */
export function stripHtml(value: string) {
  if (!value) return ''

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
    .replace(/&nbsp;/gi, ' ')
    .replace(/•/gi, '')
    .trim()
}

/**
 * Sanitizes given HTML text content.
 */
export function sanitizeHtml(value: string) {
  if (!value) return ''

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(value).trim()
}

/**
 * Syncs given bits in the database.
 */
export async function syncBits(options: BitSyncerOptions) {
  const log = new Logger('syncer:' + options.app.identifier)

  log.info('syncing bits', options)
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
    log.info('no changes were detected, no bits were synced')
    return
  }

  // there is one problematic use case - if user removes App during synchronization
  // we should not sync anything (shouldn't write any new person or bit into the database)
  // that's why we check if we have job for this particular app registered
  // and we do it twice - before saving anything to prevent further operations
  // and after saving everything to make sure app wasn't removed or requested for removal
  // while we were inserting new bits
  // if (await this.syncerRepository.isSettingRemoved()) {
  //   log.warning('found a app in a process of removal, skip syncing')
  //   return
  // }

  log.timer('save bits in the database', {
    insertedBits,
    updatedBits,
    removedBits,
    duplicateInsertBits,
  })
  try {
    await getEntityManager().transaction(async manager => {
      // insert new bits
      if (insertedBits.length > 0) {
        const insertedBitChunks = chunk(insertedBits, 50)
        for (let bits of insertedBitChunks) {
          if (options.app) {
            await isAborted(options.app)
          }
          if (options.completeBitsData) {
            await options.completeBitsData(bits)
          }
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
      if (options.completeBitsData) {
        await options.completeBitsData(updatedBits)
      }
      for (let bit of updatedBits) {
        if (options.app) {
          await isAborted(options.app)
        }
        await manager.update(BitEntity, { id: bit.id }, bit)

        const dbPeople = await manager.getRepository(BitEntity).find({
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
          log.info('found people changes in a bit', bit, { newPeople, removedPeople })

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

      // before committing transaction we make sure nobody removed app during period of save
      // we use non-transactional manager inside this method intentionally
      // if (await this.syncerRepository.isSettingRemoved()) throw 'app removed'
    })
    log.timer('save bits in the database')
  } catch (error) {
    // if (error === 'app removed') {
    //   log.warning('found a app in a process of removal, skip syncing')
    //   return
    // }
    throw error
  }
}

/**
 * Loads top words in the given text.
 */
export async function loadTextTopWords(text: string, max: number): Promise<string[]> {
  return getMediatorClient().loadMany(CosalTopWordsModel, {
    args: { text, max },
  })
}
