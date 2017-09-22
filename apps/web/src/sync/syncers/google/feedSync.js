// @flow
import { Event, Setting } from '~/app'
import Drive from 'google-drive'

export default class GithubFeedSync {
  setting: Setting
  token: string
  lastSyncs = {}

  constructor(setting: Setting, token: string) {
    this.setting = setting
    this.token = token
  }

  drive = Drive(this.token)

  run = async () => {
    console.log('run', this.drive)
  }
}
