import { SourceEntity } from '@mcro/models'
import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { SlackChannelModel, SlackSource } from '@mcro/models'
import { SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('resolver:slack-channel')

export const SlackChannelManyResolver = resolveMany(SlackChannelModel, async ({ sourceId }) => {
  const source = (await getRepository(SourceEntity).findOne({
    id: sourceId,
    type: 'slack',
  })) as SlackSource
  if (!source) {
    log.error('cannot find requested slack source', { sourceId })
    return
  }

  log.info('loading channels from the slack', { source })
  const loader = new SlackLoader(source, log)
  const channels = await loader.loadChannels()
  log.info('loaded channels', channels.map(x => x.id))
  return channels
})
