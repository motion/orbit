import { GmailSettingValues } from '@mcro/models'
import { getManager, getRepository } from 'typeorm'
import { BitEntity } from '../entities/BitEntity'
import { PersonEntity } from '../entities/PersonEntity'
import { SettingEntity } from '../entities/SettingEntity'
import { Logger } from '@mcro/logger'

const log = new Logger('integration:gmail:manager')

export class GMailManager {
  /**
   * Resets all the synchronization data.
   * Useful when its necessary to run syncer from scratch.
   */
  static async reset(setting: SettingEntity): Promise<void> {
    // todo: this logic should be extracted into separate place where settings managed
    // get entities for removal / updation
    const bits = await getRepository(BitEntity).find({ settingId: setting.id })
    const people = await getRepository(PersonEntity).find({
      settingId: setting.id,
    })

    // remove entities
    log.info(
      `removing ${bits.length} bits and ${people.length} people`,
      bits,
      people,
    )
    await getManager().remove([...bits, ...people])
    log.info('people were removed')

    // reset settings
    const values = setting.values as GmailSettingValues
    values.historyId = null
    values.lastSyncFilter = null
    values.lastSyncMax = null
    await getRepository(SettingEntity).save(setting)
  }
}
