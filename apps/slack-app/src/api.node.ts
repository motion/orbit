import { AppBit } from '@o/sync-kit'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage } from './SlackModels'

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
