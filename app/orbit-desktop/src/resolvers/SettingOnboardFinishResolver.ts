import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { SettingEntity, SettingOnboardFinishCommand } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('command:setting-onboard-finish')

export const SettingOnboardFinishResolver = resolveCommand(
  SettingOnboardFinishCommand,
  async () => {
    const setting = await getRepository(SettingEntity).findOne({ name: 'general' })
    if (!setting) {
      log.info('error - cannot find general setting')
      return
    }
    const values = setting.values
    values.hasOnboarded = true
    await getRepository(SettingEntity).save(this.generalSetting)
  },
)
