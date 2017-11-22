// @flow
import App, { Thing } from '~/app'
import { createInChunks } from '~/sync/helpers'
import debug from 'debug'

const log = _ => _ || debug('sync')

export default class SlackAttachmentSync {
  constructor({ setting, token, helpers }) {
    this.setting = setting
    this.token = token
    this.helpers = helpers
    // TODO REMOVE THIS IS TESTING PURPOSES ONLY:
    this.run()
  }

  get service() {
    return App.services.Slack
  }

  run = async () => {
    console.log('running slack sync')
    if (this.service.activeChannels) {
      for (const channelId of Object.keys(this.service.activeChannels)) {
        console.log('channelId', channelId)
      }
    }
  }
}
