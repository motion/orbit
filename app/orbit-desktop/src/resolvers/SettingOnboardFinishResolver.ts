import { logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingOnboardFinishCommand } from '@mcro/models'
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

    setting.values.hasOnboarded = true
    await this.generalSetting.save()
  },
)
