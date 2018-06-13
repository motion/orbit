import * as Slack1 from 'slack'
import { store } from '@mcro/black/store'
import { watchModel } from '@mcro/helpers'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export type SlackOpts = { oldest?: number; count: number }
export type ChannelInfo = {
  id: string
  name: string
  name_normalized: string
  purpose: { value: string }
  topic: { value: string }
  members: Array<string>
}

// @ts-ignore
const Slack = Slack1.default || Slack1

@store
export class SlackService {
  setting: any = null
  // @ts-ignore
  slack: Slack
  allChannels: Array<ChannelInfo> = []
  watch: { cancel: Function }

  constructor(setting) {
    if (!setting) {
      throw new Error('No setting')
    }
    this.watch = watchModel(
      setting.constructor,
      { type: 'slack' },
      async setting => {
        this.setting = setting
        this.slack = new Slack({ token: this.setting.token })
        this.setAllChannels(
          await this.slack.channels.list({}).then(res => res && res.channels),
        )
      },
    )
  }

  setAllChannels = channels => {
    this.allChannels = channels
  }

  dispose() {
    this.watch.cancel()
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
