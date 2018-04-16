import { Setting, Bit, Person, createOrUpdate } from '@mcro/models'
import { SlackService } from '@mcro/models/services'
import debug from '@mcro/debug'
import * as _ from 'lodash'
import * as Helpers from '~/helpers'
import createOrUpdatePerson from './slackCreateOrUpdatePerson'

const log = debug('sync slackMessages')
const slackDate = ts => new Date(+ts.split('.')[0] + 1000)

type SlackMessage = {
  type: string
  user: string
  text: string
  ts: string
}

type ChannelInfo = {
  name: string
  name_normalized: string
  purpose: { value: string }
  topic: { value: string }
  members: Array<string>
}

export default class SlackMessagesSync {
  setting: Setting
  service: SlackService
  userInfo = {}

  constructor(setting, service: SlackService) {
    this.setting = setting
    this.service = service
  }

  get lastSync() {
    return this.setting.values.lastMessageSync
  }

  run = async () => {
    const updated = await this.syncMessages()
    if (updated && updated.length) {
      log(`Slack: synced messages ${updated.length}`, updated)
    }
  }

  syncMessages = async () => {
    this.setting.values.lastMessageSync =
      this.setting.values.lastMessageSync || {}
    await this.setting.save()
    if (!this.service.activeChannels) {
      log(`Slack no active channels selected`)
      return
    }
    for (const channel of Object.keys(this.service.activeChannels)) {
      const channelInfo = await this.service.slack.channels
        .info({ channel })
        .then(res => res && res.ok && res.channel)
      if (!channelInfo) {
        console.log('no channel info')
        continue
      }
      const messages: Array<SlackMessage> = await this.service.channelHistory({
        channel,
        oldest: this.lastSync[channel],
        count: 500,
      })
      try {
        let group = []
        let created = []
        for (const next of messages) {
          const last = group[group.length - 1]
          if (!last) {
            group.push(next)
            continue
          }
          const distanceInSeconds = Math.abs(+next.ts - +last.ts)
          const isGrouped = distanceInSeconds < 150
          if (isGrouped) {
            group.push(next)
            continue
          }
          if (group.length) {
            created.push(await this.updateConversation(channelInfo, group))
            group = []
          }
        }
        if (group.length) {
          created.push(await this.updateConversation(channelInfo, group))
        }
        if (messages.length) {
          _.merge(this.setting.values, {
            lastMessageSync: {
              [channel]: _.first(messages).ts,
            },
          })
        }
        await this.setting.save()
        return created.filter(x => !!x)
      } catch (err) {
        log(`Error syncing slack message ${err.message} ${err.stack}`)
        return []
      }
    }
  }

  // cache so that we can use a Set later
  peopleCache = {}
  personCache = (id, person) => {
    this.peopleCache[id] = person
  }

  getPerson = async (userId): Promise<Person> => {
    if (this.peopleCache[userId]) {
      return this.peopleCache[userId]
    }
    let person = await Person.findOne({ integrationId: userId })
    if (person) {
      this.personCache(userId, person)
      return person
    }
    const { ok, user } = await this.service.slack.users.info({ user: userId })
    if (!ok) {
      throw new Error(`Not ok user ${userId}`)
    }
    person = await createOrUpdatePerson(user, true)
    this.personCache(userId, person)
    return person
  }

  updateConversation = async (
    channelInfo: ChannelInfo,
    messages: Array<SlackMessage>,
  ) => {
    // turns user ids into names
    const peopleIds = new Set()
    const fullMessages = await Promise.all(
      messages.map(async message => {
        const person = await this.getPerson(message.user)
        peopleIds.add(person.integrationId)
        return {
          ...message,
          name: person.name,
        }
      }),
    )
    const data = {
      channel: {
        purpose: channelInfo.purpose.value,
        topic: channelInfo.topic.value,
        members: channelInfo.members,
      },
      messages: fullMessages,
    }
    const people = [...peopleIds].map(id => this.peopleCache[id])
    return await createOrUpdate(
      Bit,
      {
        title: `#${channelInfo.name}`,
        body: messages
          .map(message => message.text)
          .join(' ... ')
          .slice(0, 255),
        identifier: Helpers.hash(data),
        data,
        bitCreatedAt: slackDate(_.last(messages).ts),
        bitUpdatedAt: slackDate(_.first(messages).ts),
        people,
        type: 'conversation',
        integration: 'slack',
      },
      ['identifier', 'integration', 'type'],
    )
  }
}
