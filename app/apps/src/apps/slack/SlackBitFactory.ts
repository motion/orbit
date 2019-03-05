import { SlackAttachment, SlackChannel, SlackMessage, SlackTeam, SlackUser } from './SlackTypes'
import { SlackBitData } from './SlackBitData'
import { AppBit, Bit } from '@mcro/models'
import { createBit } from '@mcro/sync-kit'
import { SlackAppData } from './SlackAppData'
import { buildSlackText, findMessageMentionedPeople } from './SlackUtils'

/**
 * Creates bits out of slack models.
 */
export class SlackBitFactory {

  constructor(private app: AppBit) {
  }

  /**
   * Creates a single app person from given Slack user.
   */
  createPersonBit(user: SlackUser, team: SlackTeam): Bit {
    return createBit(
      {
        appIdentifier: 'slack',
        appId: this.app.id,
        type: 'person',
        originalId: user.id,
        title: user.profile.real_name || user.name,
        webLink: `https://${team.domain}.slack.com/messages/${user.id}`,
        desktopLink: `slack://user?team=${team.id}&id=${user.id}`,
        email: user.profile.email,
        photo: user.profile.image_512,
        data: {
          tz: user.tz,
          team: user.id,
        },
      },
      user.id,
    )
  }

  /**
   * Creates a new slack conversation bit.
   */
  createConversationBit(
    channel: SlackChannel,
    messages: SlackMessage[],
    allPeople: Bit[]
  ): Bit {
    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here

    const appData: SlackAppData = this.app.data
    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const webLink = `https://${appData.values.team.domain}.slack.com/archives/${
      channel.id
      }/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${firstMessage.ts}&team=${
      appData.values.team.id
      }`
    const mentionedPeople = findMessageMentionedPeople(messages, allPeople)
    const data: SlackBitData = {
      messages: messages.reverse().map(message => ({
        user: message.user,
        text: buildSlackText(message.text, allPeople),
        time: +message.ts.split('.')[0] * 1000,
      })),
    }
    const people = allPeople.filter(person => {
      return (
        messages.some(message => {
          return message.user === person.originalId
        }) ||
        mentionedPeople.some(mentionedPerson => {
          return person.id === mentionedPerson.id
        })
      )
    })

    return createBit(
      {
        appId: this.app.id,
        appIdentifier: 'slack',
        type: 'conversation',
        title: '', // we will generate title later during bit insertion/updation
        body: data.messages.map(message => message.text).join(' ... '),
        data,
        bitCreatedAt,
        bitUpdatedAt,
        people,
        location: {
          id: channel.id,
          name: channel.name,
          webLink: `https://${appData.values.team.domain}.slack.com/archives/${channel.id}`,
          desktopLink: `slack://channel?id=${channel.id}&team=${appData.values.team.id}`,
        },
        webLink,
        desktopLink,
      },
      channel.id + '_' + firstMessage.ts,
    )
  }

  /**
   * Creates a new slack website bit.
   */
  createWebsiteBit(
    channel: SlackChannel,
    message: SlackMessage,
    attachment: SlackAttachment,
    allPeople: Bit[],
  ): Bit {
    const appData: SlackAppData = this.app.data
    const messageTime = +message.ts.split('.')[0] * 1000
    const mentionedPeople = findMessageMentionedPeople([message], allPeople)
    const people = allPeople.filter(person => {
      return (
        message.user === person.originalId ||
        mentionedPeople.some(mentionedPerson => person.id === mentionedPerson.id)
      )
    })

    return createBit(
      {
        appId: this.app.id,
        appIdentifier: 'slack',
        type: 'website',
        title: attachment.title,
        body: attachment.text,
        data: {
          url: attachment.original_url,
          title: attachment.title,
          content: '',
        },
        bitCreatedAt: messageTime,
        bitUpdatedAt: messageTime,
        people,
        location: {
          id: channel.id,
          name: channel.name,
          webLink: `https://${appData.values.team.domain}.slack.com/archives/${channel.id}`,
          desktopLink: `slack://channel?id=${channel.id}&team=${appData.values.team.id}`,
        },
        webLink: attachment.original_url,
        desktopLink: undefined,
      },
      channel.id + '_' + message.ts + '_' + attachment.id,
    )
  }

}
