import { Logger } from '@mcro/logger'
import { Bit, Person, PersonBit, SlackBitData, SlackSettingValues } from '@mcro/models'
import { chunk } from 'lodash'
import { getManager, getRepository, MoreThan } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { timeout } from '../../utils'
import { BitUtils } from '../../utils/BitUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage } from './SlackTypes'
import { SlackUtils } from './SlackUtils'

const log = new Logger('syncer:slack:messages')

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
    log.timer('load synced people from the database')
    const allPeople = await this.loadPeople()
    log.timer('load synced people from the database', allPeople)

    // if there are no people it means we run this syncer before people sync,
    // postpone syncer execution
    if (!allPeople.length) {
      log.verbose(
        'no people were found, looks like people syncer wasn\'t executed yet, scheduling restart in 10 seconds',
      )
      await timeout(10000, () => {
        log.verbose('restarting people syncer')
        return this.run()
      })
    }

    // load all slack channels
    log.timer('load API channels')
    const allChannels = await this.loader.loadChannels()
    log.timer('load API channels', allChannels)

    // filter out channels based on user settings
    const activeChannels = SlackUtils.filterChannelsBySettings(
      allChannels,
      this.setting,
    )
    log.verbose('filtering only selected channels', activeChannels)

    // go through all channels
    const values = this.setting.values as SlackSettingValues
    const lastMessageSync = values.lastMessageSync || {}
    const apiBits: Bit[] = [],
      dbBits: Bit[] = []

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
        const filteredMessages = loadedMessages.filter(
          message =>
            message.type === 'message' &&
            !message.subtype &&
            !message.bot_id &&
            message.user &&
            message.text, // snippets for example does not contain text, maybe attachments too
        )
        log.verbose('filtered messages (no bots and others)', filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        const conversations = SlackUtils.createConversation(filteredMessages)
        log.verbose(
          `created ${conversations.length} conversations`,
          conversations,
        )

        // create bits from conversations
        apiBits.push(
          ...conversations.map(messages =>
            this.createBit(channel, messages, allPeople),
          ),
        )

        // update last message sync setting
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts
      }
    }

    // calculate bits that we need to update in the database
    log.verbose(`calculating inserted/updated/removed bits`, { apiBits, dbBits })
    const insertedBits = apiBits.filter(apiBit => {
      return !dbBits.some(dbBit => dbBit.id === apiBit.id)
    })
    const updatedBits = apiBits.filter(apiBit => {
      const dbBit = dbBits.find(dbBit => dbBit.id === apiBit.id)
      return dbBit && dbBit.contentHash !== BitUtils.contentHash(apiBit)
    })
    const removedBits = dbBits.filter(dbBit => {
      return !apiBits.some(apiBit => apiBit.id === dbBit.id)
    })

    // perform database operations on synced bits
    if (insertedBits.length || updatedBits.length || removedBits.length) {
      log.timer(`saving bits in the database`, { insertedBits, updatedBits, removedBits })
      await getManager().transaction(async manager => {
        if (insertedBits.length > 0) {
          const insertedBitChunks = chunk(insertedBits, 50)
          for (let bits of insertedBitChunks) {
            await manager.insert(BitEntity, bits)
          }
        }
        for (let bit of updatedBits) {
          await manager.update(BitEntity, { id: bit.id }, bit)
        }
        if (removedBits.length > 0) {
          await manager.delete(BitEntity, removedBits)
        }
      })
      log.timer(`saving bits in the database`)
    } else {
      log.verbose(`no changes were detected`)
    }

    // update settings
    // log.verbose(`update settings`, { lastMessageSync })
    // values.lastMessageSync = lastMessageSync
    // await getRepository(SettingEntity).save(this.setting)
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
      select: ['id', 'contentHash'],
      where: {
        settingId: this.setting.id,
        location: {
          id: channelId,
        },
        bitCreatedAt: oldestMessageId
          ? MoreThan(parseInt(oldestMessageId) * 1000)
          : undefined,
      },
    })
  }

  /**
   * Creates new or updated bit.
   */
  private createBit(
    channel: SlackChannel,
    messages: SlackMessage[],
    allPeople: Person[],
  ): BitEntity {
    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here

    const firstMessage = messages[0]
    const lastMessage = messages[messages.length - 1]
    const id =
      'slack' + this.setting.id + '_' + channel.id + '_' + firstMessage.ts
    const bitCreatedAt = +firstMessage.ts.split('.')[0] * 1000
    const bitUpdatedAt = +lastMessage.ts.split('.')[0] * 1000
    const values = this.setting.values as SlackSettingValues
    const team = values.oauth.info.team
    const webLink = `https://${team.domain}.slack.com/archives/${
      channel.id
    }/p${firstMessage.ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${
      firstMessage.ts
    }&team=${team.id}`
    const body = SlackUtils.buildBitBody(messages, allPeople)
    const mentionedPeople = SlackUtils.findMessageMentionedPeople(
      messages,
      allPeople,
    )
    const data: SlackBitData = {
      messages: messages.reverse().map(message => ({
        user: message.user,
        text: message.text,
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

    return BitUtils.create({
      settingId: this.setting.id,
      integration: 'slack',
      id,
      type: 'conversation',
      title: `#${channel.name}`,
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
}
