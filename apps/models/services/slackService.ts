import * as Slack1 from 'slack'
import { Setting } from '../setting'
import { store } from '@mcro/black/store'
import { sleep } from '../helpers'

type SlackOpts = { oldest?: number; count: number }
type ChannelInfo = {
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
  // @ts-ignore
  slack: Slack
  setting: Setting
  allChannels: Array<ChannelInfo> = []
  watchInterval: any

  constructor(setting) {
    this.setting = setting
    // @ts-ignore
    this.slack = new Slack({ token: setting.token })
    this.watchData()
  }

  dispose() {
    clearInterval(this.watchInterval)
  }

  watchData() {
    // 5m
    this.watchInterval = setInterval(this.updateData, 5 * 60 * 1000)
    this.updateData()
  }

  updateData = async () => {
    this.allChannels = await this.slack.channels
      .list({})
      .then(res => res && res.channels)
  }

  get activeChannelIds() {
    const settings = this.setting.values.channels
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
