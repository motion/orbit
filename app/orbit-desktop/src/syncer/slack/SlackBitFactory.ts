import { Person } from '@mcro/models'
import { SlackBitData, SlackSettingValues } from '@mcro/models'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { BitUtils } from '../../utils/BitUtils'
import { CommonUtils } from '../../utils/CommonUtils'
import { SlackMessage } from '../../loaders/slack/SlackTypes'
import { getWordWeights, getTopWords } from '@mcro/cosal'
import { SlackChannel } from '@mcro/models'

const Autolinker = require('autolinker')

/**
 * Creates a Slack Bit.
 */
export class SlackBitFactory {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  /**
   * Creates a new bit.
   */
  async create(
    channel: SlackChannel,
    messages: SlackMessage[],
    allPeople: Person[],
  ): Promise<BitEntity> {
    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const id = CommonUtils.hash(
      'slack' + this.setting.id + '_' + channel.id + '_' + firstMessage.ts,
    )
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const values = this.setting.values as SlackSettingValues
    const team = values.oauth.info.team
    const webLink = `https://${team.domain}.slack.com/archives/${
      channel.id
    }/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${firstMessage.ts}&team=${
      team.id
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
    const title = (await getTopWords(flatBody, 10))
      // remove weird chars from title
      .map(x => x.replace(/[^a-zA-Z0-9.-]/g, ''))
      .join(' ')
    // and more for body
    const body = (await getTopWords(flatBody, 50)).join(' ')

    return BitUtils.create({
      settingId: this.setting.id,
      integration: 'slack',
      id,
      type: 'conversation',
      title,
      body,
      data,
      // raw: { channel, messages },
      bitCreatedAt,
      bitUpdatedAt,
      people,
      location: {
        id: channel.id,
        name: channel.name,
        webLink: `https://${team.domain}.slack.com/archives/${channel.id}`,
        desktopLink: `slack://channel?id=${channel.id}&team=${team.id}`,
      },
      webLink,
      desktopLink,
    })
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
