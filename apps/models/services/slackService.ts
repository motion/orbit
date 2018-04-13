import * as Slack from 'slack'
import { Setting } from '../setting'
import { store, watch } from '@mcro/black/store'

type SlackOpts = { oldest?: number; count: number }

@store
export class SlackService {
  // @ts-ignore
  slack: Slack
  setting: Setting

  @watch({ log: false })
  allChannels = () =>
    this.slack && this.slack.channels.list({}).then(res => res.channels)

  constructor(setting) {
    this.setting = setting
    console.log('Slack', Slack)
    // @ts-ignore
    this.slack = new Slack({ token: setting.token })
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
