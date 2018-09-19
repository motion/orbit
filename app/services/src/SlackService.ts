import * as Slack1 from 'slack'
import { store } from '@mcro/black'
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

// @ts-ignore
@store
export class SlackService {
  setting: Setting
  slack: any
  allChannels: Array<ChannelInfo> = []
  watch: { cancel: Function }

  constructor(setting: Setting) {
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

  get activeChannelIds() {
    const settings = (this.setting.values as any).channels
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

}
