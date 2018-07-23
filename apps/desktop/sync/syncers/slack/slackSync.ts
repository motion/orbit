import { Bit, createOrUpdateBit, Person, Setting, createOrUpdate } from '@mcro/models'
import * as _ from 'lodash'
import * as Helpers from '~/helpers'
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
    console.log(`loading slack users`);
    const users = await this.loader.loadUsers()
    console.log(`loaded slack users`, users);
    const bits = await Promise.all(users.map(user => this.createOrUpdatePerson(user)))
    console.log(`updated bits`, bits);
  }

  private async loadAllUsers() {
    console.log(`loading all slack users saved in the database`);
    this.people = await Person.find({ integration: "slack" }) // todo: we need to include setting as well
  }

  private async syncMessages(): Promise<void> {

    // load channels
    console.log(`loading slack channels`);
    const channels = await this.loader.loadChannels()
    console.log(`slack channels loaded`, channels);
    const activeChannels = filterChannelsBySettings(channels, this.setting)
    console.log(`filtering only active channels`, activeChannels);

    // load channel messages
    console.log(`loading channels messages`)
    let lastMessageSync = this.setting.values.lastMessageSync || {}
    let updatedBits: Bit[] = []

    try {
      await Promise.all(activeChannels.map(async channel => {

        // load messages
        const oldestMessageId = lastMessageSync[channel.id] ? lastMessageSync[channel.id] : undefined
        const messages = await this.loader.loadMessages(channel.id, oldestMessageId)
        console.log(`loaded channel ${channel.id} messages`, messages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        console.log(`creating conversations`)
        const conversations = createConversation(messages)
        console.log(`conversations created`, conversations)

        // create bits from conversations
        await Promise.all(conversations.map(async messages => {
          updatedBits.push(await this.createConversation(channel, messages))
        }))

      }))
      console.log("AM I FINISHED!")
    } catch (error) {
      console.log('error!!', error)
    }
    console.log("FINISHED!~")
    console.log(`updated bits`, updatedBits);

    // update settings
    console.log(`updating settings`, { lastMessageSync });
    this.setting.values.lastMessageSync = lastMessageSync
    await this.setting.save()
  }

  private async createConversation(channelInfo: SlackChannel, rawMessages: SlackMessage[]) {

    // oldest to newest
    const peopleInMessages: Person[] = []
    const messages = await Promise.all(
      rawMessages.reverse().map(async message => {

        // tood
        if (!message.user)
          return message

        const person = this.people.find(person => person.integrationId === message.user)

        if (!person) {
          console.log(`person was not found~`, person, message, this.people)
        }

        if (peopleInMessages.indexOf(person) === -1)
          peopleInMessages.push(person)
        return { // todo: unknown data type, create a separate type and find a good place for it
          ...message,
          name: person.data.name,
        }
      }),
    )
    const permalink = await this.loader.loadPermalink(channelInfo.id, messages[0].ts)
    const data = {
      permalink,
      channel: {
        id: channelInfo.id,
        purpose: channelInfo.purpose.value,
        topic: channelInfo.topic.value,
        members: channelInfo.members,
      },
      messages,
    }

    const bit = {
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
    }

    console.log(`creating a bit`, bit)
    try {
      const createdBit = await createOrUpdateBit(Bit, bit)
      console.log('bit created')
      return createdBit
    } catch (err) {
      console.log("ERROR:", err)
    }
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
