import { AppBit } from '@o/kit'
import { SlackChannel, SlackMessage } from './SlackModels'
import { SlackLoader } from './SlackLoader'

export const SlackApi = (app: AppBit) => {
  const loader = new SlackLoader(app)
  return {
    loadChannels(): Promise<SlackChannel[]> {
      return loader.loadChannels()
    },
    async loadMessages(channelId: string): Promise<SlackMessage[]> {
      const { messages } = await loader.loadMessages(channelId)
      return messages
    },
  }
}
