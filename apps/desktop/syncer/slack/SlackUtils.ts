import { Setting } from '@mcro/models'
import { SlackChannel, SlackMessage } from './SlackTypes'

/**
 * Filters given slack channels by channels in the settings.
 */
export function filterChannelsBySettings(channels: SlackChannel[], setting: Setting) {

  const settingChannels = setting.values.channels /*|| {
    "CBV9PGSGG": "CBV9PGSGG"
  }*/

  // if no channels in settings are selected then return all channels
  if (!settingChannels)
    return channels

  const settingsChannelIds = Object
    .keys(settingChannels)
    .map(key => settingChannels[key])

  return channels.filter(channel => {
    return settingsChannelIds.indexOf(channel.id) !== -1
  })
}

/**
 * Groups messages into "conversations".
 * Conversation is a group of messages left in specific period of time.
 */
export function createConversation(messages: SlackMessage[]): SlackMessage[][] {

  // push a first message as a first message in a first group
  const conversations: SlackMessage[][] = []
  for (const message of messages) {

    // push first message as a first group in a conversation
    if (message === messages[0]) {
      conversations.push([message])
      continue;
    }

    const index1 = conversations.length - 1
    const index2 = conversations[index1].length - 1
    const lastMessageInGroup = conversations[index1][index2]
    const distanceInSeconds = Math.abs(+message.ts - +lastMessageInGroup.ts)
    const isSameConversation = distanceInSeconds < 60 * 4

    // if its the same conversation we just push another message
    // if its not then create a new conversation with current message
    if (isSameConversation) {
      conversations[index1].push(message)
    } else {
      conversations.push([message])
    }

  }
  return conversations
}