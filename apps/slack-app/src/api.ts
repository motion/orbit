import { CallAppBitApiMethodCommand, command } from '@o/kit'

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
