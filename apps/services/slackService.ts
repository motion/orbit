import * as Slack1 from 'slack'
import { store } from '@mcro/black/store'
import { watchModel } from '@mcro/helpers'
import { Setting } from '@mcro/models'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export type SlackOpts = { oldest?: number; count: number }
export type ChannelInfo = {
  id: string
  name: string
  name_normalized: string
  num_members: number
  purpose?: { value: string }
  topic?: { value: string }
  members: Array<string>
}

// @ts-ignore
export const Slack = Slack1.default || Slack1

@store
export class SlackService {
  setting: Setting
  slack: any
  allChannels: Array<ChannelInfo> = []
  // watch: { cancel: Function }

  constructor(setting: Setting) {
    this.setting = setting
    this.setting = setting
    this.slack = new Slack({ token: this.setting.token })
    this.slack.channels
      .list({})
      .then(res => res && res.channels)
      .then(channels => this.setAllChannels(channels))
  }

  setAllChannels = channels => {
    this.allChannels = channels
  }

  dispose() {
  }

  get activeChannelIds() {
    const settings = this.setting.values.channels
    if (!settings) {
      console.log('no active channels', this.setting)
      return []
    }
    return Object.keys(settings).filter(x => settings[x])
  }

  get activeChannels() {
    return this.activeChannelIds.map(id =>
      this.allChannels.find(x => x.id === id),
    )
  }

  getChannelHistory = async options => {
    const res = await this.slack.channels.history(options)
    return res.messages
  }

  channelHistory = async ({ oldest, max = 5000, ...rest }) => {
    const oldestMessageTime = messages => messages[messages.length - 1].ts
    // initial results
    const options: SlackOpts = {
      count: max,
      oldest,
      ...rest,
    }
    let results = await this.getChannelHistory(options)
    if (!results.length) {
      return results
    }
    // iterate until all found
    while (results.length < max) {
      // 1000 is max per-call
      const count = Math.min(1000, max - results.length)
      const moreResults = await this.getChannelHistory({
        count,
        oldest: oldest || oldestMessageTime(results),
        ...rest,
      })
      if (!moreResults) {
        break
      }
      results = [...results, ...moreResults]
      // reached end
      if (moreResults.length < count) {
        break
      }
      // throttle
      if (results.length > 2000) {
        await sleep(300)
      }
    }
    return results
  }
}
