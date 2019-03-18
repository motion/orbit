import { SlackAppData, SlackChannel, SlackMessage } from './SlackModels'
import { Bit } from '@o/kit'

const Autolinker = require('autolinker')

/**
 * Processes text for a slack message
 */
export function buildSlackText(message: string, people: Bit[]): string {
  // merge all messages texts into a single body
  let body = message.trim()
  // replace all people id mentions in the message into a real people names
  for (let bit of people) {
    body = body.replace(new RegExp(`<@${bit.originalId}>`, 'g'), '@' + bit.title)
  }
  // make all links in the message a better formatting (without http and <>)
  const matchedLinks: string[] = []
  body = Autolinker.link(body, {
    replaceFn: match => {
      matchedLinks.push(match.getAnchorText())
      return match.getAnchorText()
    },
  })
  for (let matchedLink of matchedLinks) {
    body = body.replace(`<${matchedLink}>`, matchedLink)
  }
  return body
}

/**
 * Finds all the mentioned people in the given slack messages.
 */
export function findMessageMentionedPeople(messages: SlackMessage[], people: Bit[]) {
  const body = messages.map(message => message.text).join('')
  return people.filter(person => new RegExp(`<@${person.originalId}>`).test(body))
}

/**
 * Filters given slack channels by channels in the apps.
 */
export function filterChannelsBySettings(appData: SlackAppData, channels: SlackChannel[]) {

  // if no channels in apps are selected then return all channels
  if (!appData.values.channels) return channels

  const appsChannelIds = Object
    .keys(appData.values.channels)
    .filter(key => appData.values.channels[key])

  return channels.filter(channel => {
    return appsChannelIds.indexOf(channel.id) !== -1
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
      continue
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
