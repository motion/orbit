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
    this.watch(() => {
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
}
