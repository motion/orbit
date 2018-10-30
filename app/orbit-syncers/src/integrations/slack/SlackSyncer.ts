import { SourceEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit, SlackSource, SlackSourceValues } from '@mcro/models'
import { SlackChannel, SlackLoader, SlackMessage } from '@mcro/services'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { SlackBitFactory } from './SlackBitFactory'
import { SlackPersonFactory } from './SlackPersonFactory'

/**
 * Syncs Slack messages.
 */
export class SlackSyncer implements IntegrationSyncer {
  private log: Logger
  private source: SlackSource
  private loader: SlackLoader
  private bitFactory: SlackBitFactory
  private personFactory: SlackPersonFactory
  private personSyncer: PersonSyncer
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(source: SlackSource, log?: Logger) {
    this.source = source
    this.log = log || new Logger('syncer:slack:' + source.id)
    this.loader = new SlackLoader(this.source, this.log)
    this.bitFactory = new SlackBitFactory(this.source)
    this.personFactory = new SlackPersonFactory(this.source)
    this.personSyncer = new PersonSyncer(source, this.log)
    this.bitSyncer = new BitSyncer(source, this.log)
    this.syncerRepository = new SyncerRepository(source)
  }

  /**
   * Runs synchronization process.
   */
  async run() {
    // load team info
    this.log.timer('load team info from API')
    const team = await this.loader.loadTeam()
    this.log.timer('load team info from API')

    // update sources with team info
    const values = this.source.values as SlackSourceValues
    values.team = {
      id: team.id,
      name: team.name,
      domain: team.domain,
      icon: team.icon.image_132,
    }
    await getRepository(SourceEntity).save(this.source)

    this.log.timer('load API users')
    const apiUsers = await this.loader.loadUsers()
    this.log.timer('load API users', apiUsers.length)

    // filter out bots and strange users without emails
    const filteredApiUsers = apiUsers.filter(user => {
      return user.is_bot === false && user.profile.email
    })
    this.log.info('filtered API users (non bots)', filteredApiUsers)

    // creating entities for them
    this.log.info('finding and creating people for users', filteredApiUsers)
    const apiPeople = filteredApiUsers.map(user => {
      return this.personFactory.create(user, team)
    })

    // load all people and person bits from the local database
    this.log.timer('load synced people and person bits from the database')
    const dbPeople = await this.syncerRepository.loadDatabasePeople()
    const dbPersonBits = await this.syncerRepository.loadDatabasePersonBits({ people: dbPeople })
    this.log.timer('load synced people and person bits from the database', {
      dbPeople,
      dbPersonBits,
    })

    // sync people
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })

    // re-load database people, we need them to deal with bits
    this.log.timer('load synced people from the database')
    const allDbPeople = await this.syncerRepository.loadDatabasePeople()
    this.log.timer('load synced people from the database', allDbPeople)

    // load all slack channels
    this.log.timer('load API channels')
    const allChannels = await this.loader.loadChannels()
    this.log.timer('load API channels', allChannels)

    // filter out channels based on user sources
    const activeChannels = this.filterChannelsBySettings(allChannels)
    this.log.info('filtering only selected channels', activeChannels)

    // go through all channels
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
      this.log.timer(`loading ${channel.name}(#${channel.id}) database bits`, { oldestMessageId })
      const existBits = await this.syncerRepository.loadDatabaseBits({
        locationId: channel.id,
        oldestMessageId,
      })
      dbBits.push(...existBits)
      this.log.timer(`loading ${channel.name}(#${channel.id}) database bits`, existBits)

      // load messages
      this.log.timer(`loading ${channel.name}(#${channel.id}) API messages`, { oldestMessageId })
      const loadedMessages = await this.loader.loadMessages(channel.id, oldestMessageId)
      this.log.timer(`loading ${channel.name}(#${channel.id}) API messages`, loadedMessages)

      // sync messages if we found them
      if (loadedMessages.length) {
        // left only messages we need - real user messages, no system or bot messages
        const filteredMessages = loadedMessages.filter(
          message =>
            message.type === 'message' && !message.subtype && !message.bot_id && message.user,
        )
        this.log.info('filtered messages (no bots and others)', filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        const conversations = this.createConversation(filteredMessages)
        this.log.info(`created ${conversations.length} conversations`, conversations)

        // create bits from conversations
        const savedConversations = await Promise.all(
          conversations.map(messages => this.bitFactory.create(channel, messages, allDbPeople)),
        )

        apiBits.push(...savedConversations)

        // update last message sync source
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts
      }
    }

    // sync all the bits we have
    await this.bitSyncer.sync({ apiBits, dbBits })

    // update sources
    this.log.info('update sources', { lastMessageSync })
    values.lastMessageSync = lastMessageSync
    await getRepository(SourceEntity).save(this.source)
  }

  /**
   * Filters given slack channels by channels in the sources.
   */
  private filterChannelsBySettings(channels: SlackChannel[]) {
    const values = this.source.values as SlackSourceValues
    const sourceChannels =
      values.channels /* || {
      'C0SAU3124': true,
      'CBV9PGSGG': true,
      'C316QRE1J': true,
      'C221Y7CMN': true,
    }*/

    // if no channels in sources are selected then return all channels
    if (!sourceChannels) return channels

    const sourcesChannelIds = Object.keys(sourceChannels).filter(key => sourceChannels[key])

    return channels.filter(channel => {
      return sourcesChannelIds.indexOf(channel.id) !== -1
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
