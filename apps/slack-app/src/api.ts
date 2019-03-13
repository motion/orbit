import { command } from '@o/bridge'
import { CallAppBitApiMethodCommand } from '@o/models'

export default {
  loadChannels: (appId: number) => {
    return command(CallAppBitApiMethodCommand, {
      appId,
      appIdentifier: "slack",
      method: "loadChannels",
    })
  },
  loadMessages: (appId: number, channelId: string) => {
    return command(CallAppBitApiMethodCommand, {
      appId,
      appIdentifier: "slack",
      method: "loadChannels",
      args: [channelId]
    })
  }
}
