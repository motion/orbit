import { Logger } from '@mcro/logger'
import { Bit, Person, PersonBit, SlackBitData, SlackSettingValues } from '@mcro/models'
import { getRepository, MoreThan } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { timeout } from '../../utils'
import { BitUtils } from '../../utils/BitUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackBitFactory } from './SlackBitFactory'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage } from './SlackTypes'

const log = new Logger('syncer:slack:messages')

/**
 * Syncs Slack messages.
 */
export class SlackMessagesSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: SlackLoader
  private bitFactory: SlackBitFactory

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
    this.bitFactory = new SlackBitFactory(this.setting)
  }

  async run() {

    // load people, we need them to deal with bits
    // note that people must be synced before this syncer's sync
    log.timer(`load synced people from the database`)
    const allPeople = await this.loadPeople()
    log.timer(`load synced people from the database`, allPeople)

    // if there are no people it means we run this syncer before people sync,
    // postpone syncer execution
    if (!allPeople.length) {
      log.verbose(`no people were found, looks like people syncer wasn't executed yet, scheduling restart in 10 seconds`)
      await timeout(10000, () => {
        log.verbose(`restarting people syncer`)
        return this.run()
      })
      return
    }

    // load all slack channels
    log.timer(`load API channels`)
    const allChannels = await this.loader.loadChannels()
    log.timer(`load API channels`, allChannels)

    // filter out channels based on user settings
    const activeChannels = this.filterChannelsBySettings(allChannels)
    log.verbose(`filtering only selected channels`, activeChannels)

    // go through all channels
    const values = this.setting.values as SlackSettingValues
    const lastMessageSync = values.lastMessageSync || {}
    const apiBits: Bit[] = [], dbBits: Bit[] = []

    for (let channel of activeChannels) {
      // to load messages using pagination we use "oldest" message we got last time when we synced
      // BUT we also need to support edit and remove last x messages
      // (since we can't have up-to-date edit and remove of all messages)
      const oldestMessageId = lastMessageSync[channel.id]
        ? String(parseInt(lastMessageSync[channel.id]) - 60 * 60 * 24)
        : undefined

      // we need to load all bits in the data range period we are working with (oldestMessageId)
      // because we do comparision and update bits, also we remove removed messages
      log.timer(`loading ${channel.name}(#${channel.id}) database bits`, { oldestMessageId })
      const existBits = await this.loadLatestBits(channel.id, oldestMessageId)
      dbBits.push(...existBits)
      log.timer(`loading ${channel.name}(#${channel.id}) database bits`, existBits)

      // load messages
      log.timer(`loading ${channel.name}(#${channel.id}) API messages`, { oldestMessageId })
      const loadedMessages = await this.loader.loadMessages(channel.id, oldestMessageId)
      log.timer(`loading ${channel.name}(#${channel.id}) API messages`, loadedMessages)

      // sync messages if we found them
      if (loadedMessages.length) {

        // left only messages we need - real user messages, no system or bot messages
        const filteredMessages = loadedMessages.filter(message => (
          message.type === 'message' &&
          !message.subtype &&
          !message.bot_id &&
          message.user
        ))
        log.verbose(`filtered messages (no bots and others)`, filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        const conversations = this.createConversation(filteredMessages)
        log.verbose(`created ${conversations.length} conversations`, conversations)

        // create bits from conversations
        const savedConversations = await Promise.all(conversations.map(messages => this.bitFactory.create(
          channel,
          messages,
          allPeople,
        )))

        apiBits.push(
          ...savedConversations,
        )

        // update last message sync setting
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts
      }
    }

    // sync all the bits we have
    await BitUtils.sync(log, apiBits, dbBits)

    // update settings
    log.verbose(`update settings`, { lastMessageSync })
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
  private loadLatestBits(channelId: string, oldestMessageId?: string) {
    return getRepository(BitEntity).find({
      select: {
        id: true,
        contentHash: true,
      },
      where: {
        settingId: this.setting.id,
        location: {
          id: channelId,
        },
        bitCreatedAt: oldestMessageId ? MoreThan(parseInt(oldestMessageId) * 1000) : undefined,
      }
    })
  }

  /**
   * Filters given slack channels by channels in the settings.
   */
  private filterChannelsBySettings(channels: SlackChannel[]) {

    const values = this.setting.values as SlackSettingValues
    const settingChannels =
      values.channels/* || {
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
  private createConversation(messages: SlackMessage[]): SlackMessage[][] {
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

}
