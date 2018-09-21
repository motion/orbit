import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import {
  SettingForceSyncCommand,
  SettingRemoveCommand,
  SlackChannelModel,
  SlackSettingBlacklistCommand,
  SlackSettingValues,
} from '@mcro/models'
import { SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'
import { SettingEntity } from '@mcro/entities'

const log = new Logger(`resolver:slack-channel`)

export const SlackChannelManyResolver = resolveMany(
  SlackChannelModel,
  async ({ settingId }) => {

    const setting = await getRepository(SettingEntity).findOne({
      id: settingId,
      type: 'slack',
    })
    if (!setting) {
      log.error(`cannot find requested slack setting`, { settingId })
      return
    }

    log.info(`loading channels from the slack`, { setting })
    const loader = new SlackLoader(setting)
    const channels = await loader.loadChannels()
    log.info(`loaded channels`, channels)
    return channels
  },
)
