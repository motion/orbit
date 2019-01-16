import { loadMany } from '@mcro/model-bridge'
import { BitUtils } from '@mcro/models'
import { Bit, CosalTopWordsModel, Person, SlackBitData, SlackSource } from '@mcro/models'
import { SlackChannel, SlackMessage, SlackAttachment } from '@mcro/services'
import { WebsiteCrawledData } from '../website/WebsiteCrawledData'

const Autolinker = require('autolinker')

/**
 * Creates a Slack Bit.
 */
export class SlackBitFactory {
  private source: SlackSource

  constructor(source: SlackSource) {
    this.source = source
  }

  /**
   * Creates a new slack conversation bit.
   */
  async createConversation(
    channel: SlackChannel,
    messages: SlackMessage[],
    allPeople: Person[],
  ): Promise<Bit> {
    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const webLink = `https://${this.source.values.team.domain}.slack.com/archives/${
      channel.id
    }/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${firstMessage.ts}&team=${
      this.source.values.team.id
    }`
    const mentionedPeople = this.findMessageMentionedPeople(messages, allPeople)
    const data: SlackBitData = {
      messages: messages.reverse().map(message => ({
        user: message.user,
        text: this.buildSlackText(message.text, allPeople),
        time: +message.ts.split('.')[0] * 1000,
      })),
    }
    const people = allPeople.filter(person => {
      return (
        messages.some(message => {
          return message.user === person.integrationId
        }) ||
        mentionedPeople.some(mentionedPerson => {
          return person.id === mentionedPerson.id
        })
      )
    })

    const flatBody = data.messages.map(x => x.text).join(' ')
    // gets the most interesting 10 for title

    console.log('load cosal top words...')
    const title = (await loadMany(CosalTopWordsModel, { args: { text: flatBody, max: 6 } })).join(
      ' ',
    )

    return BitUtils.create(
      {
        sourceId: this.source.id,
        integration: 'slack',
        type: 'conversation',
        title,
        body: '',
        data,
        bitCreatedAt,
        bitUpdatedAt,
        people,
        location: {
          id: channel.id,
          name: channel.name,
          webLink: `https://${this.source.values.team.domain}.slack.com/archives/${channel.id}`,
          desktopLink: `slack://channel?id=${channel.id}&team=${this.source.values.team.id}`,
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
  createWebsite(
    channel: SlackChannel,
    message: SlackMessage,
    attachment: SlackAttachment,
    websiteData: WebsiteCrawledData,
    allPeople: Person[],
  ): Bit {
    const messageTime = +message.ts.split('.')[0] * 1000
    const mentionedPeople = this.findMessageMentionedPeople([message], allPeople)
    const people = allPeople.filter(person => {
      return (
        message.user === person.integrationId ||
        mentionedPeople.some(mentionedPerson => person.id === mentionedPerson.id)
      )
    })

    return BitUtils.create(
      {
        sourceId: this.source.id,
        integration: 'slack',
        type: 'website',
        title: attachment.title,
        body: attachment.text,
        data: websiteData,
        bitCreatedAt: messageTime,
        bitUpdatedAt: messageTime,
        people,
        location: {
          id: channel.id,
          name: channel.name,
          webLink: `https://${this.source.values.team.domain}.slack.com/archives/${channel.id}`,
          desktopLink: `slack://channel?id=${channel.id}&team=${this.source.values.team.id}`,
        },
        webLink: attachment.original_url,
        desktopLink: undefined,
      },
      channel.id + '_' + message.ts + '_' + attachment.id,
    )
  }

  /**
   * Processes text for a slack message
   */
  private buildSlackText(message: string, allPeople: Person[]): string {
    // merge all messages texts into a single body
    let body = message.trim()
    // replace all people id mentions in the message into a real people names
    for (let person of allPeople) {
      body = body.replace(new RegExp(`<@${person.integrationId}>`, 'g'), '@' + person.name)
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
  private findMessageMentionedPeople(messages: SlackMessage[], allPeople: Person[]) {
    const body = messages.map(message => message.text).join('')
    return allPeople.filter(person => new RegExp(`<@${person.integrationId}>`).test(body))
  }
}
