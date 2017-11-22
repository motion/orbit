// @flow
import Slack from 'slack'
import { store } from '@mcro/black'
import { CurrentUser } from '~/app'

@store
export default class SlackService {
  slack = null

  constructor() {
    this.watch(() => {
      const { slack } = (CurrentUser.user && CurrentUser.authorizations) || {}
      if (slack && !this.slack) {
        this.slack = new Slack({
          token: slack.token,
        })
      }
    })
  }

  get setting(): ?string {
    return CurrentUser.setting.slack
  }

  get activeChannels() {
    return this.setting.values.channels
  }
}
