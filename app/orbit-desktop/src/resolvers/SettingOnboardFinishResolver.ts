import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { SettingOnboardFinishCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SettingEntity } from '@mcro/entities'

const log = new Logger('command:setting-onboard-finish')

export const SettingOnboardFinishResolver = resolveCommand(
  SettingOnboardFinishCommand,
  async () => {
    const setting = await getRepository(SettingEntity).findOne()
    if (!setting) {
      log.info('error - cannot find general setting')
      return
    }
    const values = setting.values
    values.hasOnboarded = true
    await getRepository(SettingEntity).save(this.generalSetting)
  },
)
