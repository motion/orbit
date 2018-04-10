import { Setting, Bit, createOrUpdate } from '@mcro/models'
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

export default class SlackMessagesSync {
  setting: Setting
  service: SlackService

  constructor(setting) {
    this.setting = setting
    this.service = new SlackService(setting)
  }

  get lastSync() {
    return this.setting.values.lastMessageSync || {}
  }

  run = async () => {
    console.log('Running slack sync')
    if (!this.service.activeChannels) {
      return
    }
    for (const channel of Object.keys(this.service.activeChannels)) {
      const oldestSynced = this.lastSync[channel]
      const info = await this.service.slack.channels.info({ channel })
      const messages: Array<SlackMessage> = await this.service.channelHistory({
        channel,
        oldest: oldestSynced,
        count: 2000,
      })
      console.log('got messages', messages)
      try {
        let group = []
        for (const next of messages) {
          const last = group[group.length - 1]
          if (!last) {
            group.push(next)
            continue
          }
          // within 15 seconds
          const isGrouped = +next.ts - +last.ts < 15000
          if (isGrouped) {
            group.push(next)
            continue
          }
          if (group.length) {
            await this.createConversation(channel, group)
            group = []
          }
        }
        if (group.length) {
          await this.createConversation(channel, group)
        }
        const oldestSyncedTime = messages[messages.length - 1].ts
        console.log('update oldestSyncedTime', oldestSyncedTime)
        this.setting.values = {
          ...this.setting.values,
          lastMessageSync: {
            ...this.setting.values.lastMessageSync,
            [channel]: oldestSyncedTime,
          },
        }
        await this.setting.save()
      } catch (err) {
        log(`Error syncing slack message ${err.message}`)
      }
    }
  }

  createConversation = async (
    channel: string,
    messages: Array<SlackMessage>,
  ) => {
    await createOrUpdate(
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
