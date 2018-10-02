import { JobEntity, SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'

/**
 * Syncer queries.
 */
export class SyncerQueries {

  /**
   * Makes sure setting isn't removed or in process of removal.
   */
  static async isSettingRemoved(settingId: number): Promise<boolean> {
    const setting = await getRepository(SettingEntity).findOne(settingId)
    if (!setting)
      return true

    const jobs = await getRepository(JobEntity).find({
      settingId: settingId,
      type: "INTEGRATION_REMOVE",
      status: "PROCESSING"
    })
    if (jobs.length > 0)
      return true

    return false
  }

}
