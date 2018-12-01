import { BitEntity, JobEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/models'
import { Bit, Person, PersonBit, Source } from '@mcro/models'
import { hash } from '@mcro/utils'
import { getRepository, In, MoreThan } from 'typeorm'

/**
 * Executes common syncer queries.
 */
export class SyncerRepository {
  private source: Source

  constructor(source: Source) {
    this.source = source
  }

  /**
   * Makes sure source isn't removed or in process of removal.
   */
  async isSettingRemoved(): Promise<boolean> {
    const source = await getRepository(SettingEntity).findOne(this.source.id)
    if (!source) return true

    const jobs = await getRepository(JobEntity).find({
      sourceId: this.source.id,
      type: 'INTEGRATION_REMOVE',
      status: 'PROCESSING',
    })
    if (jobs.length > 0) return true

    return false
  }

  /**
   * Loads bits in a given period.
   */
  async loadDatabaseBits(options?: {
    ids?: number[]
    locationId?: string
    oldestMessageId?: string
  }): Promise<Bit[]> {
    if (!options) options = {}
    return getRepository(BitEntity).find({
      select: {
        id: true,
        contentHash: true,
      },
      where: {
        id: options.ids ? In(options.ids) : undefined,
        sourceId: this.source.id,
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
   * Loads all exist database people for the current integration.
   */
  async loadDatabasePeople(options?: { ids?: number[] }): Promise<Person[]> {
    if (!options) options = {}
    return getRepository(PersonEntity).find({
      // select: {
      //   id: true,
      //   contentHash: true
      // },
      // relations: {
      //   personBit: true
      // },
      where: {
        id: options.ids ? In(options.ids) : undefined,
        sourceId: this.source.id,
      },
    })
  }

  /**
   * Loads all exist database person bits for the given people.
   */
  async loadDatabasePersonBits(options?: {
    // ids?: number[],
    people?: Person[]
  }): Promise<PersonBit[]> {
    if (!options) options = {}
    const ids = (options.people || [])
      .filter(person => !!person.email)
      .map(person => hash(person.email))
    return getRepository(PersonBitEntity).find({
      // select: {
      //   email: true,
      //   contentHash: true
      // },
      relations: {
        people: true,
      },
      where: {
        id: ids ? In(ids) : undefined,
      },
    })
  }
}
