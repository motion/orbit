import { BitEntity, JobEntity, PersonBitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Bit, Person, PersonBit, Setting } from '@mcro/models'
import { hash } from '@mcro/utils'
import { getRepository, In, MoreThan } from 'typeorm'

/**
 * Executes common syncer queries.
 */
export class SyncerRepository {
  private setting: Setting
  
  constructor(setting: Setting) {
    this.setting = setting
  }

  /**
   * Makes sure setting isn't removed or in process of removal.
   */
  async isSettingRemoved(): Promise<boolean> {
    const setting = await getRepository(SettingEntity).findOne(this.setting.id)
    if (!setting)
      return true

    const jobs = await getRepository(JobEntity).find({
      settingId: this.setting.id,
      type: "INTEGRATION_REMOVE",
      status: "PROCESSING"
    })
    if (jobs.length > 0)
      return true

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
        contentHash: true
      },
      where: {
        id: options.ids ? In(options.ids) : undefined,
        settingId: this.setting.id,
        location: {
          id: options.locationId ? options.locationId : undefined,
        },
        bitCreatedAt: options.oldestMessageId ? MoreThan(parseInt(options.oldestMessageId) * 1000) : undefined,
      }
    })
  }

  /**
   * Loads all exist database people for the current integration.
   */
  async loadDatabasePeople(options?: {
    ids?: number[],
  }): Promise<Person[]> {
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
        settingId: this.setting.id
      }
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
        people: true
      },
      where: {
        id: ids ? In(ids) : undefined
      }
    })
  }

}
