import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { AppEntity, SlackChannelModel } from '@mcro/models'
import { SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('resolver:slack-channel')

export const SlackChannelManyResolver = resolveMany(SlackChannelModel, async ({ appId }) => {
  const app = await getRepository(AppEntity).findOne({
    id: appId,
  })
  if (!app) {
    log.error('cannot find requested slack app', { appId })
    return
  }

  log.info('loading channels from the slack', { app })
  // TODO @umed why wont this accept 'slack'
  const loader = new SlackLoader(app as any, log)
  const channels = await loader.loadChannels()
  log.info('loaded channels', channels.map(x => x.id))
  return channels
})
