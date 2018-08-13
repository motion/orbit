import { Person } from '@mcro/models'
import * as _ from 'lodash'
import { getRepository, MoreThan } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonBitEntity } from '../../entities/PersonBitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { createOrUpdatePersonBit } from '../../repository'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { sequence, assign } from '../../utils'
import { SlackLoader } from './SlackLoader'
import { SlackChannel, SlackMessage, SlackUser } from './SlackTypes'
import { createConversation, filterChannelsBySettings } from './SlackUtils'
import { SettingEntity } from '../../entities/SettingEntity'
import { logger } from '@mcro/logger'
const Autolinker = require( 'autolinker')

const log = logger('syncer:slack')

/**
 * Syncs Slack Bits.
 */
export class SlackSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: SlackLoader
  private people: Person[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
  }

  async run() {
    this.people = await this.syncUsers()
    await this.syncMessages()
  }

  async reset(): Promise<void> {

  }

  /**
   * Syncs people from Slack API.
   * Returns all people (entities) from this integration.
   */
  private async syncUsers(): Promise<Person[]> {
    // loading users from API
    log(`loading users`)
    const users = await this.loader.loadUsers()
    log(`loaded users`, users)

    // filter out bots and strange users without emails
    const cleanUsers = users.filter(user => user.is_bot === false && user.profile.email)
    log(`filtered users (non bots)`, cleanUsers)

    // load all persons in local database
    const existPeople = await PersonEntity.find({
      where: {
        settingId: this.setting.id
      },
      relations: {
        personBit: {
          bits: true
        }
      }
    })

    // creating entities for them
    log(`finding and creating people for users`, cleanUsers)
    const updatedPeople = cleanUsers.map(user =>
      this.createPerson(existPeople, user),
    )
    log(`updated people`, updatedPeople)

    // update in the database
    await PersonEntity.save(updatedPeople)

    // add person bits
    await Promise.all(
      updatedPeople.map(async person => {
        person.personBit = await createOrUpdatePersonBit({
          email: person.data.profile.email,
          name: person.name,
          photo: person.data.profile.image_512,
          integration: 'slack',
          person: person,
        })
      }),
    )

    log(`people were updated`, updatedPeople)

    // find remove people and remove them from the database
    const removedPeople = existPeople.filter(
      person => updatedPeople.indexOf(person) === -1,
    )
    await PersonEntity.remove(removedPeople)
    log(`people were removed`, removedPeople)

    return updatedPeople
  }

  /**
   * Syncs messages from Slack API.
   */
  private async syncMessages(): Promise<void> {
    // load channels
    log(`loading channels`)
    const channels = await this.loader.loadChannels()
    log(`channels loaded`, channels)

    // filter channels by only needed (based on settings)
    const activeChannels = filterChannelsBySettings(channels, this.setting)
    log(`filtering only selected channels`, activeChannels)

    // load channel messages
    log(`loading channels messages`)
    const lastMessageSync = this.setting.values.lastMessageSync || {}

    // load messages for each channel
    const updatedBits: BitEntity[] = [],
      removedBits: BitEntity[] = []
    await sequence(activeChannels, async channel => {
      // to load messages using pagination we use "oldest" message we got last time when we synced
      // BUT we also need to support edit and remove last x messages
      // (since we can't have up-to-date edit and remove of all messages)
      const oldestMessageId = lastMessageSync[channel.id]
        ? String(parseInt(lastMessageSync[channel.id]) - 60 * 60 * 24)
        : undefined

      // load messages
      log(`loading channel ${channel.id} messages`, { oldestMessageId })
      const loadedMessages = await this.loader.loadMessages(
        channel.id,
        oldestMessageId,
      )
      log(`loaded messages`, loadedMessages)

      // sync messages if we found them
      if (loadedMessages.length) {
        // left only messages we need - real user messages, no system or bot messages
        const filteredMessages = loadedMessages.filter(message => {
          return (
            message.type === 'message' &&
            !message.subtype &&
            !message.bot_id &&
            message.user
          )
        })
        log(`filter out unnecessary messages`, filteredMessages)

        // group messages into special "conversations" to avoid insertion of multiple bits for each message
        log(`creating conversations`)
        const conversations = createConversation(filteredMessages)
        log(`created ${conversations.length} conversations`, conversations)

        // create bits from conversations
        await sequence(conversations, async messages => {

          // get people from messages
          const people: Person[] = this.people.filter(person => {
            return messages.find(message => message.user === person.integrationId)
          })

          // create and save a new conversion bit
          const bit = await this.createConversation(channel, messages, people)
          await BitEntity.save(bit)
          updatedBits.push(bit)

          // add bits to the list of person bits
          for (let person of people) {
            const hasBit = person.personBit.bits.some(personBitBit => {
              return personBitBit.id === bit.id
            })
            if (!hasBit)
              person.personBit.bits.push(bit)

            console.log("person.personBit", person.personBit)
            await getRepository(PersonBitEntity).save(person.personBit)
          }
        })

        // create new bits
        log(`updated message bits`, updatedBits)

        // update last message sync setting
        // note: we need to use loaded messages, not filtered
        lastMessageSync[channel.id] = loadedMessages[0].ts
      }

      // find bits in the database and check if they all exist
      if (oldestMessageId) {
        // find bits in the database
        log(`loading latest bits to check if some were removed`)
        const latestBits = await BitEntity.find({
          settingId: this.setting.id,
          location: {
            id: channel.id,
          },
          bitCreatedAt: MoreThan(parseInt(oldestMessageId)),
        })
        log(`latest bits were loaded`, latestBits)

        // if there is no loaded message for bit in the database
        // then we shall remove such bits
        removedBits.push(
          ...latestBits.filter(existBit => {
            return !updatedBits.some(updatedBit => {
              return updatedBit.id === existBit.id
            })
          }),
        )
        log(`removed message bits`, removedBits)
        await BitEntity.remove(removedBits)
      }
    })

    // update settings
    log(`updating settings`, { lastMessageSync })
    this.setting.values.lastMessageSync = lastMessageSync
    await this.setting.save()
  }

  /**
   * Creates a single integration person from given Slack user.
   */
  private createPerson(people: PersonEntity[], user: SlackUser): PersonEntity {
    const id = `slack-${this.setting.id}-${user.id}`
    const person = people.find(person => person.id === id) || new PersonEntity()

    return assign(person, {
      setting: this.setting,
      id: id,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data: user as any,
      webLink: `https://${this.setting.values.oauth.info.team.id}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${this.setting.values.oauth.info.team.id}&id=${user.id}`,
    })
  }

  /**
   * Creates a single conversation Bit from given Slack messages.
   */
  private async createConversation(
    channel: SlackChannel,
    messages: SlackMessage[],
    people: Person[],
  ): Promise<BitEntity> {
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

    // create a bit body - main searching content
    // todo: extract body creation into separate helper
    let body = messages
      .map(message => message.text)
      .join(' ... ')
      .slice(0, 255)

    for (let person of this.people) {
      body = body.replace(`<@${person.data.id}>`, person.name)
    }

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

    const id = 'slack' + this.setting.id + '_' + channel.id + '_' + messages[0].ts
    const bitCreatedAt = +_.first(messages).ts.split('.')[0] * 1000
    const bitUpdatedAt = +_.last(messages).ts.split('.')[0] * 1000
    const team = this.setting.values.oauth.info.team

    const webLink = `https://${team.domain}.slack.com/archives/${channel.id}/p${messages[0].ts.replace('.', '')}`
    const desktopLink = `slack://channel?id=${channel.id}&message=${messages[0].ts}&team=${team.id}`

    const bit = await BitEntity.findOne({
      settingId: this.setting.id,
      id,
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
