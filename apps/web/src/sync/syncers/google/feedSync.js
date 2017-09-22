// @flow
import { Event, Setting } from '~/app'
import GAPI from './api'

export default class GithubFeedSync {
  setting: Setting
  token: string
  lastSyncs = {}

  constructor(setting: Setting, token: string) {
    this.setting = setting
    this.token = token
  }

  api = new GAPI({ key: this.token })

  run = async () => {
    console.log('run', this.api)
  }
}
