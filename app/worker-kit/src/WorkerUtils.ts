import { Logger } from '@o/logger'
import { MediatorClient } from '@o/mediator'
import { AppBit, AppEntity, Bit, BitContentType, BitEntity, CosalTopWordsModel, Location, WorkerUtilsInstance } from '@o/models'
import { sleep, stringHash } from '@o/utils'
import { chunk, uniqBy } from 'lodash'
import { EntityManager, In, MoreThan } from 'typeorm'

/**
 * Common utils for syncers.
 */
export class WorkerUtils implements WorkerUtilsInstance {
  isAborted: () => Promise<boolean>

  constructor(
    private app: AppBit,
    private log: Logger,
    private manager: EntityManager,
    private mediator: MediatorClient,
    isAborted: () => Promise<boolean>,
  ) {
    this.isAborted = isAborted
  }

  /**
   * Loads apps from the database.
   */
  async loadApps(options?: { identifier: string }): Promise<AppBit[]> {
    this.log.timer('load apps from the database', options)
    const apps = await this.manager.getRepository(AppEntity).find({
      identifier: options ? options.identifier : undefined,
    })
    this.log.timer('load apps from the database', apps)
    return apps
  }

  /**
   * Loads bits from the database.
   */
  async loadBits(options?: {
    idsOnly?: boolean
    ids?: number[]
    type?: BitContentType
    appIdentifiers?: string[]
    locationId?: string
    bitCreatedAtMoreThan?: number
  }): Promise<Bit[]> {
    const findOptions = {
      select:
        options && options.idsOnly
          ? {
              id: true,
              contentHash: true,
            }
          : undefined,
      where: {
        appId: this.app.id,
        id: options && options.ids ? In(options.ids) : undefined,
        type: options ? options.type : undefined,
        appIdentifier:
          options && options.appIdentifiers && options.appIdentifiers.length
            ? In(options.appIdentifiers)
            : undefined,
        location: {
          id: options.locationId ? options.locationId : undefined,
        },
        bitCreatedAt: options.bitCreatedAtMoreThan
          ? MoreThan(options.bitCreatedAtMoreThan)
          : undefined,
      },
    }
    this.log.timer('load bits from the database', options, findOptions)
    const bits = await this.manager.getRepository(BitEntity).find(findOptions)
    this.log.timer('load bits from the database', bits)
    return bits
  }

  /**
   * Saves a given bit.
   */
  async saveBit(bit: Bit): Promise<void> {
    this.log.verbose('saving bit', bit)
    await this.manager.getRepository(BitEntity).save(bit, { listeners: false })
  }

  /**
   * Saves a given bits.
   */
  async saveBits(bits: Bit[]): Promise<void> {
    this.log.verbose('saving bits', bits)
    await this.manager.getRepository(BitEntity).save(bits, { listeners: false })
  }

  /**
   * Removes a given bit.
   */
  async removeBit(bit: Bit): Promise<void> {
    this.log.verbose('remove bit', bit)
    await this.manager.getRepository(BitEntity).remove(bit as BitEntity, { listeners: false })
  }

  /**
   * Removes given bits.
   */
  async removeBits(bits: Bit[]): Promise<void> {
    this.log.verbose('removing bits', bits)
    await this.manager.getRepository(BitEntity).remove(bits as BitEntity[], { listeners: false })
  }

  /**
   * Deletes all the app bits from the database.
   */
  async clearBits(): Promise<void> {
    const bits = await this.manager.getRepository(BitEntity).find({ appId: this.app.id })
    await this.manager.getRepository(BitEntity).remove(bits, { listeners: false })
  }

  /**
   * Syncs given bits in the database.
   */
  async syncBits(
    apiBits: Bit[],
    dbBits: Bit[],
    options?: {
      completeBitsData?: (bits: Bit[]) => void | Promise<void>
    },
  ) {
    this.log.info('syncing bits', { apiBits, dbBits, options })

    // make sure we don't have duplicated bits
    apiBits = uniqBy(apiBits, bit => bit.id)
    dbBits = uniqBy(dbBits, bit => bit.id)

    // calculate bits that we need to update in the database
    this.log.timer('calculating bits change set')
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
    this.log.timer('calculating bits change set', {
      insertedBits,
      updatedBits,
      removedBits,
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

    this.log.timer('save bits in the database', {
      insertedBits,
      updatedBits,
      removedBits,
      duplicateInsertBits,
    })

    // await this.manager.save(BitEntity, insertedBits, { chunk: 100 })
    // await this.manager.save(BitEntity, updatedBits, { chunk: 100 })
    // await this.manager.remove(BitEntity, removedBits as any[], { chunk: 100 })

    await this.manager.transaction(async manager => {
      // insert new bits
      if (insertedBits.length > 0) {
        const insertedBitChunks = chunk(insertedBits, 50)
        for (let bits of insertedBitChunks) {
          if (this.app) {
            await this.isAborted()
          }
          if (options && options.completeBitsData) {
            await options.completeBitsData(bits)
          }
          await manager.insert(BitEntity, bits)
          // Add some small throttle
          await sleep(20)
        }
        for (let bit of insertedBits) {
          if (bit.people && bit.people.length) {
            await manager
              .createQueryBuilder(BitEntity, 'bit')
              .relation('people')
              .of(bit)
              .add(bit.people)
          }
        }
      }

      // update changed bits
      if (options && options.completeBitsData) {
        await options.completeBitsData(updatedBits)
      }
      for (let bit of updatedBits) {
        if (this.app) {
          await this.isAborted()
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

      // before committing transaction we make sure nobody removed app during period of save
      // we use non-transactional manager inside this method intentionally
      // if (await this.syncerRepository.isSettingRemoved()) throw 'app removed'
    })
    this.log.timer('save bits in the database')
  }

  /**
   * Loads top words in the given text.
   */
  async loadTextTopWords(text: string, max: number): Promise<string[]> {
    return this.mediator.loadMany(CosalTopWordsModel, {
      args: { text, max },
    })
  }

  /**
   * Updates app bit's data in the database.
   */
  async updateAppData(): Promise<void> {
    this.log.verbose('update app data', this.app.data)
    await this.manager.getRepository(AppEntity).save(this.app, { listeners: false })
  }

  /**
   * Creates a bit id.
   */
  generateBitId(data: string): number {
    return stringHash(`${this.app.identifier}-${this.app.id}-${data}`)
  }

  /**
   * Creates a new bit and sets given properties to it.
   */
  createBit(properties: {
    type: BitContentType
    originalId: string
    title: string
    bitUpdatedAt?: number
    bitCreatedAt?: number
    body?: string
    authorId?: number
    // createdAt?: Date
    // updatedAt?: Date
    email?: string
    photo?: string
    webLink?: string
    desktopLink?: string
    author?: Bit
    people?: Bit[]
    data?: any
    location?: Location
    crawled?: boolean
  }) {
    const bit: Bit = { target: 'bit', ...properties }
    bit.appId = this.app.id
    bit.appIdentifier = this.app.identifier
    bit.id = this.generateBitId(bit.originalId)
    bit.contentHash = this.bitContentHash(bit) // todo: find out why contentHash is generated before everything else
    return bit
  }

  /**
   * Creates a content hash for a given bit.
   */
  bitContentHash(bit: Bit): number {
    return stringHash(
      JSON.stringify(
        [
          bit.id,
          bit.appId,
          bit.app ? bit.app.id : bit.appId,
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
        ].filter(item => item !== null && item !== undefined),
      ),
    )
  }
}
