import { logger } from '@mcro/logger'
import { Bit, Person, PersonBit, SlackBitData } from '@mcro/models'
import { SlackSettingValues } from '@mcro/models'
import * as _ from 'lodash'
import { getRepository, MoreThan } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { assign, timeout } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage } from './SlackTypes'
import { SlackUtils } from './SlackUtils'

const log = logger('syncer:slack:messages')

/**
 * Syncs Slack messages.
 */
export class SlackMessagesSyncer implements IntegrationSyncer {
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

    // if there are no people it means we run this syncer before people sync,
    // postpone syncer execution
    if (!allPeople.length) {
      log(`no people were found, looks like people syncer wasn't executed yet, scheduling restart in 10 seconds`)
      await timeout(10000, () => {
        log(`restarting people syncer`)
        return this.run()
      })

    } else {
      log(`loaded people`, allPeople)
    }

    // load all slack channels
    log(`loading API channels`)
    const allChannels = await this.loader.loadChannels()
    log(`channels loaded`, allChannels)

    // filter out channels based on user settings
    const activeChannels = SlackUtils.filterChannelsBySettings(allChannels, this.setting)
    log(`filtering only selected channels`, activeChannels)

    // go through all channels
    const values = this.setting.values as SlackSettingValues
    const lastMessageSync = values.lastMessageSync || {}
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

      // we need to load all bits in the data range period we are working with (oldestMessageId)
      // because we do comparision and update bits, also we remove removed messages
      // if oldestMessageId is missing it means this is a first time loading for this slack channel
      // and we don't have bits in the database yet
      let existBits: BitEntity[] = []
      if (oldestMessageId) {
        log(`loading channel ${channel.id} exist database bits`, { oldestMessageId })
        existBits = await this.loadLatestBits(channel.id, oldestMessageId)
        log(`exist database bits were loaded`, existBits)
      }

      // sync messages if we found them
      if (loadedMessages.length) {

        // left only messages we need - real user messages, no system or bot messages
        const filteredMessages = loadedMessages.filter(message => (
          message.type === 'message' &&
          !message.subtype &&
          !message.bot_id &&
          message.user &&
          message.text // snippets for example does not contain text, maybe attachments too
        ))
        log(`filtered messages (no bots and others)`, filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        const conversations = SlackUtils.createConversation(filteredMessages)
        log(`created ${conversations.length} conversations`, conversations)

        // create bits from conversations
        updatedBits.push(
          ...conversations.map(messages => this.createBit(
            channel,
            messages,
            existBits,
            allPeople,
          )),
        )

        // update last message sync setting
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts
      }

      // compare database bits with loaded bits and if some loaded bits were removed
      // add them to the list of bits needs to be removed
      removedBits.push(...existBits.filter(existBit => {
        return !updatedBits.some(updatedBit => {
          return updatedBit.id === existBit.id
        })
      }))
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
    values.lastMessageSync = lastMessageSync
    await getRepository(SettingEntity).save(this.setting)
  }

  /**
   * Loads all people from this slack org.
   */
  private loadPeople() {
    return getRepository(PersonEntity).find({
      where: {
        settingId: this.setting.id,
      },
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
  private createBit(
    channel: SlackChannel,
    messages: SlackMessage[],
    bits: BitEntity[],
    allPeople: Person[],
  ): BitEntity {

    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const id = 'slack' + this.setting.id + '_' + channel.id + '_' + firstMessage.ts
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const values = this.setting.values as SlackSettingValues
    const team = values.oauth.info.team
    const webLink = `https://${team.domain}.slack.com/archives/${channel.id}/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${firstMessage.ts}&team=${team.id}`
    const body = SlackUtils.buildBitBody(messages, allPeople)
    const bit = bits.find(bit => bit.id === id)
    const mentionedPeople = SlackUtils.findMessageMentionedPeople(messages, allPeople)
    const data: SlackBitData = {
      messages: messages.reverse().map(message => ({
        user: message.user,
        text: message.text,
        time: +message.ts.split('.')[0] * 1000,
      })),
    }
    const people = allPeople.filter(person => {
      return messages.some(message => {
        return message.user === person.integrationId
      }) || mentionedPeople.some(mentionedPerson => {
        return person.id === mentionedPerson.id
      })
    })

    return assign(bit || new BitEntity(), {
      setting: this.setting,
      integration: 'slack',
      id,
      type: 'conversation',
      title: `#${channel.name}`,
      body,
      data,
      raw: { channel, messages },
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
