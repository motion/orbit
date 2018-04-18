import { Setting, Bit, Person, createOrUpdate, Job } from '@mcro/models'
import { SlackService } from '@mcro/models/services'
import debug from '@mcro/debug'
import * as _ from 'lodash'
import * as Helpers from '~/helpers'
import createOrUpdatePerson from './slackCreateOrUpdatePerson'

const log = debug('sync.slackMessages')
const slackDate = ts => new Date(+ts.split('.')[0] + 1000)

type SlackMessage = {
  type: string
  user: string
  text: string
  ts: string
}

type ChannelInfo = {
  id: string
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

  setupSetting = async () => {
    this.setting.values.lastMessageSync =
      this.setting.values.lastMessageSync || {}
    await this.setting.save()
  }

  run = async () => {
    if (await Job.lastProcessing()) {
      log(`Already processing! Try .reset() to clear`)
      return
    }
    await this.setupSetting()
    const updated = await this.syncMessages()
    if (updated && updated.length) {
      log(`Slack: synced messages ${updated.length}`, updated)
    }
  }

  reset = async () => {
    const bits = await Bit.find({ integration: 'slack', type: 'conversation' })
    await Promise.all(bits.map(bit => bit.remove()))
    this.setting.values.lastMessageSync = {}
    await this.setting.save()
    await Promise.all(
      Job.find({ where: { type: 'slack', action: 'messages' } }).map(j =>
        j.remove(),
      ),
    )
  }

  syncMessages = async () => {
    if (!this.service.activeChannels) {
      log(`Slack no active channels selected`)
      return
    }
    for (const channel of Object.keys(this.service.activeChannels)) {
      if (!this.service.activeChannels[channel]) {
        continue
      }
      const channelInfo = await this.getChannelInfo(channel)
      if (!channelInfo) {
        console.log('no channel info')
        continue
      }
      const messages: Array<SlackMessage> = await this.service.channelHistory({
        channel,
        oldest: this.lastSync[channel],
        count: 1000,
      })
      if (!messages.length) {
        log(`No new slack messages`)
        return []
      }
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
          const isGrouped = distanceInSeconds < 60 * 4
          if (isGrouped) {
            group.push(next)
            continue
          }
          if (group.length) {
            created.push(await this.createConversation(channelInfo, group))
          }
          group = [next]
        }
        if (group.length) {
          created.push(await this.createConversation(channelInfo, group))
        }
        // update setting
        _.merge(this.setting.values, {
          lastMessageSync: {
            [channel]: _.first(messages).ts,
          },
        })
        await this.setting.save()
        return created.filter(x => !!x)
      } catch (err) {
        log(`Error syncing slack message ${err.message} ${err.stack}`)
        return []
      }
    }
  }

  getChannelInfo = async (channel): Promise<ChannelInfo> => {
    const info = await this.service.slack.channels
      .info({ channel })
      .then(res => res && res.ok && res.channel)
    return {
      ...info,
      id: channel,
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

  createConversation = async (
    channelInfo: ChannelInfo,
    rawMessages: Array<SlackMessage>,
  ) => {
    // turns user ids into names
    const peopleIds = new Set()
    // oldest to newest
    const messages = await Promise.all(
      rawMessages.reverse().map(async message => {
        const person = await this.getPerson(message.user)
        peopleIds.add(person.integrationId)
        return {
          ...message,
          name: person.data.name,
        }
      }),
    )
    const { permalink } = await this.service.slack.chat.getPermalink({
      channel: channelInfo.id,
      message_ts: messages[0].ts,
    })
    const people = [...peopleIds].map(id => this.peopleCache[id])
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
        bitCreatedAt: slackDate(_.first(messages).ts),
        bitUpdatedAt: slackDate(_.last(messages).ts),
        people,
        type: 'conversation',
        integration: 'slack',
      },
      ['identifier'],
    )
  }
}
