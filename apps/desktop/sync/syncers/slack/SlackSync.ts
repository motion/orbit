import { Bit, Location, Person, Setting } from '@mcro/models'
import * as _ from 'lodash'
import { MoreThan } from 'typeorm'
import { sequence } from '~/utils'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage, SlackUser } from './SlackTypes'
import { createConversation, filterChannelsBySettings } from './SlackUtils'

/**
 * Syncs Slack Bits.
 */
export class SlackSync {
  setting: Setting
  loader: SlackLoader
  people: Person[]

  constructor(setting: Setting) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
  }

  async run() {
    try {
      this.people = await this.syncUsers()
      await this.syncMessages()

    } catch (error) { // todo: error catching should be on top-level
      console.log(`error in slack syncer`, error)
    }
  }

  /**
   * Syncs people from Slack API.
   * Returns all people (entities) from this integration.
   */
  private async syncUsers(): Promise<Person[]> {

    // loading users from API
    console.log(`loading users`)
    const users = await this.loader.loadUsers()

    // load all persons in local database
    const existPeople = await Person.find({ settingId: this.setting.id })

    // creating entities for them
    console.log(`finding and creating people for users`, users)
    const updatedPeople = users.map(user => this.createPerson(existPeople, user))
    console.log(`updated people`, updatedPeople)

    // update in the database
    await Person.save(updatedPeople)
    console.log(`people were updated`, updatedPeople)

    // find remove people and remove them from the database
    const removedPeople = existPeople.filter(person => updatedPeople.indexOf(person) === -1)
    await Person.remove(removedPeople)
    console.log(`people were removed`, removedPeople)

    return updatedPeople
  }

  /**
   * Syncs messages from Slack API.
   */
  private async syncMessages(): Promise<void> {

    // load channels
    console.log(`loading channels`)
    const channels = await this.loader.loadChannels()
    console.log(`channels loaded`, channels)

    // filter channels by only needed (based on settings)
    const activeChannels = filterChannelsBySettings(channels, this.setting)
    console.log(`filtering only selected channels`, activeChannels)

    // load channel messages
    console.log(`loading channels messages`)
    const lastMessageSync = this.setting.values.lastMessageSync || {}

    // load messages for each channel
    const updatedBits: Bit[] = [], removedBits: Bit[] = []
    await sequence(activeChannels, async channel => {

      // to load messages using pagination we use "oldest" message we got last time when we synced
      // BUT we also need to support edit and remove last x messages
      // (since we can't have up-to-date edit and remove of all messages)
      const oldestMessageId = lastMessageSync[channel.id]
        ? String(parseInt(lastMessageSync[channel.id]) - 60 * 60 * 24)
        : undefined

      // load messages
      console.log(`loading channel ${channel.id} messages`, { oldestMessageId })
      const loadedMessages = await this.loader.loadMessages(channel.id, oldestMessageId)

      // sync messages if we found them
      if (loadedMessages.length) {

        // left only messages we need - real user messages, no system or bot messages
        console.log(`loaded messages`, loadedMessages)
        const filteredMessages = loadedMessages.filter(message => {
          return message.type === 'message' &&
            !message.subtype &&
            !message.bot_id &&
            message.user
        })
        console.log(`filter out unnecessary messages`, filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        console.log(`creating conversations`)
        const conversations = createConversation(filteredMessages)
        console.log(`created ${conversations.length} conversations`, conversations)

        // create bits from conversations
        await sequence(conversations, async messages => {
          updatedBits.push(await this.createConversation(channel, messages))
        })

        // update last message sync setting
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts

      } else {
        console.log(`no new messages found`)
      }

      // find bits in the database and check if they all exist
      if (oldestMessageId) {

        // find bits in the database
        console.log(`loading latest bits to check if some were removed`)
        const latestBits = await Bit.find({
          settingId: this.setting.id,
          location: {
            id: channel.id
          },
          time: MoreThan(parseInt(oldestMessageId))
        })
        console.log(`latest bits were loaded`, latestBits)

        // if there is no loaded message for bit in the database
        // then we shall remove such bits
        removedBits.push(...latestBits.filter(bit => {
          return !loadedMessages.some(message => {
            return bit.bitCreatedAt === message.ts
          })
        }))
        console.log(`bits to be removed`, removedBits)
      }

    })

    // create new bits
    console.log(`updated message bits`, updatedBits)
    await Bit.save(updatedBits)

    console.log(`removed message bits`, removedBits)
    await Bit.remove(removedBits)

    // update settings
    console.log(`updating settings`, { lastMessageSync })
    this.setting.values.lastMessageSync = lastMessageSync
    await this.setting.save()
  }

  /**
   * Creates a single integration person from given Slack user.
   */
  private createPerson(people: Person[], user: SlackUser): Person {

    const identifier = `slack-person-${user.id}`
    const person = people.find(person => person.identifier === identifier)

    return Object.assign(person || new Person(), {
      setting: this.setting,
      identifier,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data: user,
    })
  }

  /**
   * Creates a single conversation Bit from given Slack messages.
   */
  private async createConversation(
    channel: SlackChannel,
    messages: SlackMessage[],
  ): Promise<Bit> {

    // we need message in a reverse order
    // by default messages we get are in last-first order,
    // but we need in last-last order here
    messages = messages.reverse()

    // get people from messages
    const people: Person[] = this.people.filter(person => {
      return messages.find(message => message.user === person.integrationId)
    })

    // create a new messages structure special for a data property
    const dataMessages = messages.map(message => {
      const person = people.find(person => person.integrationId === message.user)
      return {
        name: person.data.name, // todo: looks weird, person name alongside message and its called "message name"?
        ...message
      }
    })

    // create a bit body - main searching content
    const body = messages
      .map(message => message.text)
      .join(' ... ')
      .slice(0, 255)

    const identifier = channel.id + '_' + messages[0].ts
    const bitCreatedAt = new Date(+_.first(messages).ts.split('.')[0] + 1000)
    const bitUpdatedAt = new Date(+_.last(messages).ts.split('.')[0] + 1000)
    const team = this.setting.values.oauth.info.team

    const location = new Location()
    location.id = channel.id
    location.name = channel.name
    location.webLink = `https://${team.domain}.slack.com/archives/${channel.id}`
    location.desktopLink = `slack://channel?id=${channel.id}&team=${team.id}`

    const webLink = `https://${team.domain}.slack.com/archives/${channel.id}/p${messages[0].ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${messages[0].ts}&team=${team.id}`

    const bit = await Bit.findOne({
      settingId: this.setting.id,
      identifier
    })

    return Object.assign(bit || new Bit(), {
      setting: this.setting,
      integration: 'slack',
      identifier,
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
      location,
      webLink,
      desktopLink,
      time: bitCreatedAt,
    })
  }

}
