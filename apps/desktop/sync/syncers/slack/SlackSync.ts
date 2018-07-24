import { Bit, createOrUpdateBit, Person, Setting, createOrUpdate } from '@mcro/models'
import * as _ from 'lodash'
import * as Helpers from '~/helpers'
import { sequence } from '~/utils'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage, SlackUser } from './SlackTypes'
import { createConversation, filterChannelsBySettings } from './SlackUtils'

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
      await this.syncUsers()
      await this.loadAllUsers()
      await this.syncMessages()

    } catch (error) {
      console.log(`error in slack syncer`, error)
    }
  }

  private async syncUsers() {
    console.log(`loading users`);
    const users = await this.loader.loadUsers()
    console.log(`loaded slack users`, users);
    const bits = await Promise.all(users.map(user => this.createOrUpdatePerson(user)))
    console.log(`updated person bits`, bits);
  }

  private async loadAllUsers() {
    console.log(`loading all slack users saved in the database`);
    this.people = await Person.find({ integration: "slack" }) // todo: we need to include setting as well
  }

  private async syncMessages(): Promise<void> {

    // load channels
    console.log(`loading channels`);
    const channels = await this.loader.loadChannels()
    console.log(`channels loaded`, channels);
    const activeChannels = filterChannelsBySettings(channels, this.setting)
    console.log(`filtering only selected channels`, activeChannels);

    // load channel messages
    console.log(`loading channels messages`)
    const lastMessageSync = this.setting.values.lastMessageSync || {}
    const updatedBits: Bit[] = []

    await sequence(activeChannels, async channel => {

      // load messages
      const oldestMessageId = lastMessageSync[channel.id] ? lastMessageSync[channel.id] : undefined
      console.log(`loading channel ${channel.id} messages`, { oldestMessageId })
      const loadedMessages = await this.loader.loadMessages(channel.id, oldestMessageId)

      // do not processed if no messages found
      if (!loadedMessages.length) {
        console.log(`no new messages found`)
        return
      }

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
        const permalink = await this.loader.loadPermalink(channel.id, messages[0].ts)
        updatedBits.push(await this.createConversation(channel, messages, permalink))
      })

      // update last message sync setting
      // note: we need to use loaded messages, not filtered
      lastMessageSync[channel.id] = loadedMessages[0].ts

    })
    console.log(`updated message bits`, updatedBits);

    // update settings
    console.log(`updating settings`, { lastMessageSync });
    this.setting.values.lastMessageSync = lastMessageSync
    await this.setting.save()
  }

  private async createConversation(channelInfo: SlackChannel,
                                   messages: SlackMessage[],
                                   permalink: string) {

    // we need message in a reverse order
    // by default messages we get are in last-first order, but we need in last-last order
    messages = messages.reverse()

    // get people from messages
    const peopleInMessages: Person[] = this.people.filter(person => {
      return messages.find(message => message.user === person.integrationId)
    })

    const data = {
      permalink,
      channel: {
        id: channelInfo.id,
        purpose: channelInfo.purpose.value,
        topic: channelInfo.topic.value,
        members: channelInfo.members,
      },
      messages: messages.map(message => {
        const person = peopleInMessages.find(person => person.integrationId === message.user)
        return {
          name: person.data.name,
          ...message
        }
      }),
    }

    return createOrUpdateBit(Bit, {
      title: `#${channelInfo.name}`,
      body: messages
        .map(message => message.text)
        .join(' ... ')
        .slice(0, 255),
      identifier: Helpers.hash(data),
      data,
      bitCreatedAt: new Date(+_.first(messages).ts.split('.')[0] + 1000),
      bitUpdatedAt: new Date(+_.last(messages).ts.split('.')[0] + 1000),
      people: peopleInMessages,
      type: 'conversation',
      integration: 'slack',
    })
  }

  private async createOrUpdatePerson(person: SlackUser, returnIfUnchanged = false) {
    return await createOrUpdate(
      Person,
      {
        identifier: `slack-person-${person.id}`,
        integrationId: person.id,
        integration: 'slack',
        name: person.profile.real_name || person.name,
        data: {
          ...person,
        },
      },
      { matching: Person.identifyingKeys, returnIfUnchanged },
    )
  }

}
