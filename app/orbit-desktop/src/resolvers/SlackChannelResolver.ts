import { SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { SlackChannelModel, SlackSource } from '@mcro/models'
import { SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('resolver:slack-channel')

export const SlackChannelManyResolver = resolveMany(SlackChannelModel, async ({ settingId }) => {
  const setting = (await getRepository(SettingEntity).findOne({
    id: settingId,
    type: 'slack',
  })) as SlackSource
  if (!setting) {
    log.error('cannot find requested slack setting', { settingId })
    return
  }

  log.info('loading channels from the slack', { setting })
  const loader = new SlackLoader(setting, log)
  const channels = await loader.loadChannels()
  log.info('loaded channels', channels.map(x => x.id))
  return channels
})
