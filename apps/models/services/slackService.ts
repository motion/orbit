import * as Slack1 from 'slack'
import { Setting } from '../setting'
import { store } from '@mcro/black/store'

type SlackOpts = { oldest?: number; count: number }

// @ts-ignore
const Slack = Slack1.default || Slack1

@store
export class SlackService {
  // @ts-ignore
  slack: Slack
  setting: Setting
  allChannels: Array<Object> = []

  constructor(setting) {
    this.setting = setting
    // @ts-ignore
    this.slack = new Slack({ token: setting.token })
    this.watchData()
  }

  watchData() {
    setInterval(this.updateData, 15000)
    this.updateData()
  }

  updateData = async () => {
    this.allChannels = await this.slack.channels
      .list({})
      .then(res => res && res.channels)
  }

  get activeChannels() {
    return this.setting.values.channels
  }

  getChannelHistory = async options => {
    const res = await this.slack.channels.history(options)
    return res.messages
  }

  channelHistory = async ({ oldest, count, ...rest }) => {
    const oldestMessageTime = messages => messages[messages.length - 1].ts
    const oldestWanted = (ts = 0) =>
      ts && oldest ? Math.min(+oldest, +ts) : ts || oldest
    // initial results
    const options: SlackOpts = {
      count: Math.min(1000, count),
      ...rest,
    }
    if (oldestWanted()) {
      options.oldest = oldestWanted()
    }
    let results = await this.getChannelHistory(options)
    if (!results.length) {
      return results
    }
    // iterate until all found
    while (results.length < count) {
      const newcount = Math.min(1000, count - results.length)
      const moreResults = await this.getChannelHistory({
        count: newcount,
        oldest: oldestWanted(oldestMessageTime(results)),
        ...rest,
      })
      // no more left
      if (!moreResults || !moreResults.length) {
        break
      }
      results = [...results, ...moreResults]
    }
    return results
  }
}
