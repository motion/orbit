import { logger } from '@mcro/logger'
import { Bit, Person, PersonBit } from '@mcro/models'
import * as _ from 'lodash'
import { getRepository, MoreThan } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage } from './SlackTypes'
import { SlackUtils } from './SlackUtils'

const log = logger('syncer:slack:issues')

/**
 * Syncs Slack issues.
 */
export class SlackIssuesSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: SlackLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
  }

  async run() {

    // load people, we need them to deal with bits
    // note that people must be synced before this syncer's sync
    log(`loading (already synced) people`)
    const allPeople = await this.loadPeople()
    log(`loaded people`, allPeople)

    // load all slack channels
    log(`loading API channels`)
    const allChannels = await this.loader.loadChannels()
    log(`channels loaded`, allChannels)

    // filter out channels based on user settings
    const activeChannels = SlackUtils.filterChannelsBySettings(allChannels, this.setting)
    log(`filtering only selected channels`, activeChannels)

    // go through all channels
    const lastMessageSync = this.setting.values.lastMessageSync || {}
    const updatedBits: Bit[] = [],
      removedBits: Bit[] = []

    for (let channel of activeChannels) {
      // to load messages using pagination we use "oldest" message we got last time when we synced
      // BUT we also need to support edit and remove last x messages
      // (since we can't have up-to-date edit and remove of all messages)
      const oldestMessageId = lastMessageSync[channel.id]
        ? String(parseInt(lastMessageSync[channel.id]) - 60 * 60 * 24)
        : undefined

      // load messages
      log(`loading channel ${channel.id} messages`, { oldestMessageId })
      const loadedMessages = await this.loader.loadMessages(channel.id, oldestMessageId)
      log(`loaded messages`, loadedMessages)

      // sync messages if we found them
      if (loadedMessages.length) {

        // left only messages we need - real user messages, no system or bot messages
        const filteredMessages = loadedMessages.filter(message => (
          message.type === 'message' &&
          !message.subtype &&
          !message.bot_id &&
          message.user
        ))
        log(`filtered messages (no bots and others)`, filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        const conversations = SlackUtils.createConversation(filteredMessages)
        log(`created ${conversations.length} conversations`, conversations)

        // create bits from conversations
        for (let messages of conversations) {

          // get people involved in conversation
          const messagesPeople: Person[] = allPeople.filter(person => {
            return messages.find(message => message.user === person.integrationId)
          })
          log(`found people ${messagesPeople.length} people in conversation`, messagesPeople, messages)

          // create and save a new conversion bit
          const bit = await this.createBit(
            channel,
            messages,
            messagesPeople,
            allPeople,
          )
          updatedBits.push(bit)
        }

        // update last message sync setting
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts
      }

      // find bits in the database and check if they all exist
      if (oldestMessageId) {

        // find bits in the database
        log(`loading latest bits to check if some were removed`)
        const latestBits = await this.loadLatestBits(channel.id, oldestMessageId)
        log(`latest bits were loaded`, latestBits)

        // if there is no loaded message for bit in the database
        // then we shall remove such bits
        removedBits.push(...latestBits.filter(existBit => {
          return !updatedBits.some(updatedBit => {
            return updatedBit.id === existBit.id
          })
        }))
      }
    }

    // update and remove bits
    log(`saving bits`, updatedBits)
    await getRepository(BitEntity).save(updatedBits, { chunk: 100 })
    log(`bits are saved`)
    log(`removing bits`, removedBits)
    await getRepository(BitEntity).remove(removedBits as BitEntity[], { chunk: 100 })
    log(`bits are removed`)

    // update settings
    log(`updating settings`, { lastMessageSync })
    this.setting.values.lastMessageSync = lastMessageSync
    await getRepository(SettingEntity).save(this.setting)
  }

  /**
   * Loads all people from this slack org.
   */
  private loadPeople() {
    return getRepository(PersonEntity).find({
      where: {
        settingId: this.setting.id,
      }
    })
  }

  /**
   * Loads bits in a given period.
   */
  private loadLatestBits(channelId: string, oldestMessageId: string) {
    return getRepository(BitEntity).find({
      settingId: this.setting.id,
      location: {
        id: channelId,
      },
      bitCreatedAt: MoreThan(parseInt(oldestMessageId) * 1000),
    })
  }

  /**
   * Creates new or updated bit.
   */
  private async createBit(
    channel: SlackChannel,
    messages: SlackMessage[],
    people: Person[],
    allPeople: Person[],
  ): Promise<BitEntity> {

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const id = 'slack' + this.setting.id + '_' + channel.id + '_' + firstMessage.ts
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const team = this.setting.values.oauth.info.team
    const webLink = `https://${team.domain}.slack.com/archives/${channel.id}/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${firstMessage.ts}&team=${team.id}`
    const body = SlackUtils.buildBitBody(messages, allPeople)
    const bit = await BitEntity.findOne({
      settingId: this.setting.id,
      id,
    })

    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here
    messages = messages.reverse()

    // create a new messages structure special for a data property
    const dataMessages = messages.map(message => {
      const person = people.find(
        person => person.integrationId === message.user,
      )
      return {
        name: person.data.name, // todo: looks weird, person name alongside message and its called "message name"?
        ...message,
      }
    })

    return assign(bit || new BitEntity(), {
      setting: this.setting,
      integration: 'slack',
      id,
      type: 'conversation',
      title: `#${channel.name}`,
      body,
      data: {
        channel: {
          id: channel.id,
          purpose: channel.purpose.value,
          topic: channel.topic.value,
          members: channel.members,
        },
        messages: dataMessages,
      },
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

}
