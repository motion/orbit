import { Setting, Bit, Person, createOrUpdate } from '@mcro/models'
import { SlackService } from '@mcro/models/services'
// import { createInChunks } from '~/sync/helpers'
import * as Constants from '~/constants'
import debug from '@mcro/debug'
import * as _ from 'lodash'
import * as Helpers from '~/helpers'

const log = debug('sync slackMessages')

type SlackMessage = {
  type: string
  user: string
  text: string
  ts: string
}

type SlackPerson = {
  id: string
  deleted: boolean
  is_app_user: boolean
  is_bot: boolean
  name: string
  team_id: string
  updated: number
  profile: {
    avatar_hash: string
    display_name: string
    display_name_normalized: string
    email: string
    first_name: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    last_name: string
    phone: string
    real_name: string
    real_name_normalized: string
    skype: string
    status_emoji: string
    status_expiration: number
    status_text: string
    team: string
    title: string
  }
}

export default class SlackMessagesSync {
  setting: Setting
  service: SlackService

  constructor(setting) {
    this.setting = setting
    this.service = new SlackService(setting)
  }

  get lastSync() {
    return
  }

  run = async () => {
    const updated = [
      ...(await this.syncPeople()),
      ...(await this.syncMessages()),
    ]
    if (updated.length) {
      log(`Slack: synced ${updated.length}`, updated)
    }
  }

  syncPeople = async () => {
    const { members, cache_ts } = await this.service.slack.users.list()
    const created = []
    for (const member of members) {
      if (await this.updatePerson(member)) {
        created.push(member)
      }
    }
    return created
  }

  updatePerson = async (person: SlackPerson) => {
    return await createOrUpdate(
      Person,
      {
        identifier: `slack-${Helpers.hash(person)}`,
        name: person.name,
        data: person,
      },
      Person.identifyingKeys,
    )
  }

  syncMessages = async () => {
    this.setting.values.lastMessageSync =
      this.setting.values.lastMessageSync || {}
    await this.setting.save()
    if (!this.service.activeChannels) {
      return
    }
    for (const channel of Object.keys(this.service.activeChannels)) {
      const info = await this.service.slack.channels.info({ channel })
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
          const isGrouped = distanceInSeconds < 15
          if (isGrouped) {
            group.push(next)
            continue
          }
          if (group.length) {
            created.push(await this.updateConversation(channel, group))
            group = []
          }
        }
        if (group.length) {
          created.push(await this.updateConversation(channel, group))
        }
        _.merge(this.setting.values, {
          lastMessageSync: {
            [channel]: _.first(messages).ts,
          },
        })
        await this.setting.save()
        return created.filter(x => !!x)
      } catch (err) {
        log(`Error syncing slack message ${err.message}`)
        return []
      }
    }
  }

  updateConversation = async (
    channel: string,
    messages: Array<SlackMessage>,
  ) => {
    return await createOrUpdate(
      Bit,
      {
        title: `Conversation in ${channel}`,
        body: messages
          .map(message => message.text)
          .join(' ... ')
          .slice(0, 255),
        identifier: Helpers.hash(messages.map(x => JSON.stringify(x)).join('')),
        data: {
          messages,
        },
        bitCreatedAt: _.last(messages).ts,
        bitUpdatedAt: _.first(messages).ts,
        type: 'conversation',
        integration: 'slack',
      },
      ['identifier', 'integration', 'type'],
    )
  }
}
