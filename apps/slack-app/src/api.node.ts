import { AppBit } from '@o/sync-kit'
import { WebClient } from '@slack/client'
import { SlackChannel, SlackMessage } from './SlackModels'
import { SlackLoader } from './SlackLoader'

export default {
  loadChannels(app: AppBit): Promise<SlackChannel[]> {
    const loader = new SlackLoader(app)
    return loader.loadChannels()
  },
  async loadMessages(app: AppBit, channelId: string): Promise<SlackMessage[]> {
    const loader = new SlackLoader(app)
    const { messages } = await loader.loadMessages(channelId)
    return messages
  }
}

export function slackApi(app: AppBit) {
  const client = new WebClient(app.token)
  client.channels.list()
  return client
}