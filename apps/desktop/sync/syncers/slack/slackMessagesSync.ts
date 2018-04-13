import { Setting, Bit, createOrUpdate } from '@mcro/models'
import { SlackService } from '@mcro/models/services'
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

export default class SlackMessagesSync {
  setting: Setting
  service: SlackService

  constructor(setting, service: SlackService) {
    this.setting = setting
    this.service = service
  }

  get lastSync() {
    return this.setting.values.lastMessageSync
  }

  run = async () => {
    const updated = await this.syncMessages()
    if (updated.length) {
      log(`Slack: synced messages ${updated.length}`, updated)
    }
  }

  syncMessages = async () => {
    this.setting.values.lastMessageSync =
      this.setting.values.lastMessageSync || {}
    await this.setting.save()
    if (!this.service.activeChannels) {
      return
    }
    for (const channel of Object.keys(this.service.activeChannels)) {
      // const info = await this.service.slack.channels.info({ channel })
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
            created.push(await this.updateConversation(channel, group))
            group = []
          }
        }
        if (group.length) {
          created.push(await this.updateConversation(channel, group))
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
