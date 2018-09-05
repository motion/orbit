import { logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingOnboardFinishCommand, GeneralSettingValues } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SettingEntity } from '../entities/SettingEntity'

const log = logger('command:setting-onboard-finish')

export const SettingOnboardFinishResolver = resolveCommand(
  SettingOnboardFinishCommand,
  async () => {
    const setting = await getRepository(SettingEntity).findOne({
      where: { type: 'general', category: 'general' },
    })
    if (!setting) {
      log('error - cannot find general setting')
      return
    }

    const values = setting.values as GeneralSettingValues
    values.hasOnboarded = true
    await this.generalSetting.save()
  },
)
