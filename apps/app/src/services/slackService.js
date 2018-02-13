// @flow
import Slack from 'slack'
import { store, watch } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class SlackService {
  slack = null

  @watch
  allChannels = () =>
    this.slack && this.slack.channels.list({}).then(res => res.channels)

  constructor() {
    this.watch(function watchSlackToken() {
      const { token } = this
      if (token && !this.slack) {
        this.slack = new Slack({ token })
      }
    })
  }

  get token() {
    return (
      CurrentUser.user &&
      CurrentUser.authorizations &&
      CurrentUser.authorizations.slack &&
      CurrentUser.authorizations.slack.token
    )
  }

  get setting(): ?string {
    return CurrentUser.setting.slack
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
    const oldestWanted = ts =>
      ts && oldest ? Math.min(+oldest, +ts) : ts || oldest
    // initial results
    const options = {
      count: Math.min(1000, count),
      ...rest,
    }
    if (oldestWanted()) {
      options.oldest = oldestWanted()
    }
    let results = await this.getChannelHistory(options)
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
