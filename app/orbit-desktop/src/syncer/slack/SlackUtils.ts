import { SlackSettingValues } from '@mcro/models'
import { SlackChannel, SlackMessage } from './SlackTypes'
import { SettingEntity } from '../../entities/SettingEntity'
import { Person, SlackPersonData } from '@mcro/models'

const Autolinker = require('autolinker')

/**
 * Group of helper utilities to work with Slack Syncer.
 */
export class SlackUtils {
  /**
   * Filters given slack channels by channels in the settings.
   */
  static filterChannelsBySettings(
    channels: SlackChannel[],
    setting: SettingEntity,
  ) {
    const values = setting.values as SlackSettingValues
    const settingChannels =
      values.channels /*|| {
      'C0SAU3124': true,
      'CBV9PGSGG': true,
      'C316QRE1J': true,
      'C221Y7CMN': true,
    }*/

    // if no channels in settings are selected then return all channels
    if (!settingChannels) return channels

    const settingsChannelIds = Object.keys(settingChannels).filter(
      key => settingChannels[key],
    )

    return channels.filter(channel => {
      return settingsChannelIds.indexOf(channel.id) !== -1
    })
  }

  /**
   * Groups messages into "conversations".
   * Conversation is a group of messages left in specific period of time.
   */
  static createConversation(messages: SlackMessage[]): SlackMessage[][] {
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

  /**
   * Finds all the mentioned people in the given slack messages.
   */
  static findMessageMentionedPeople(
    messages: SlackMessage[],
    allPeople: Person[],
  ) {
    const body = messages.map(message => message.text).join('')
    return allPeople.filter(person =>
      new RegExp(`<@${person.integrationId}>`).test(body),
    )
  }

  /**
   * Builds "body" for a Bit object.
   */
  static buildBitBody(messages: SlackMessage[], allPeople: Person[]): string {
    // merge all messages texts into a single body
    let body = messages.map(message => message.text.trim()).join(' ... ')

    // replace all people id mentions in the message into a real people names
    for (let person of allPeople) {
      body = body.replace(`<@${person.integrationId}>`, person.name)
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
}
