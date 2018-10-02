import { JobEntity, SettingEntity } from '@mcro/entities'
import { BitEntity, PersonBitEntity, PersonEntity } from '@mcro/entities'
import { Setting } from '@mcro/models'
import { getRepository, In } from 'typeorm'

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
  async loadDatabaseBits(bitIds: number[]) {
    return getRepository(BitEntity).find({
      select: {
        id: true,
        contentHash: true
      },
      where: {
        id: In(bitIds),
        settingId: this.setting.id
      }
    })
  }

  /**
   * Loads all exist database people for the current integration.
   */
  async loadDatabasePeople(ids: number[]) {
    return getRepository(PersonEntity).find({
      // select: {
      //   id: true,
      //   contentHash: true
      // },
      // relations: {
      //   personBit: true
      // },
      where: {
        id: In(ids),
        settingId: this.setting.id
      }
    })
  }

  /**
   * Loads all exist database person bits for the given people.
   */
  async loadDatabasePersonBits(ids: number[]) {
    return getRepository(PersonBitEntity).find({
      // select: {
      //   email: true,
      //   contentHash: true
      // },
      relations: {
        people: true
      },
      where: {
        id: In(ids)
      }
    })
  }

}
