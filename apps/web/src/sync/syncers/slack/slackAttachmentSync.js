// @flow
import App, { Thing } from '~/app'
import { createInChunks } from '~/sync/helpers'
import debug from 'debug'
import * as _ from 'lodash'

const log = _ => _ || debug('sync')

export default class SlackAttachmentSync {
  constructor({ setting, token, helpers }) {
    this.setting = setting
    this.token = token
    this.helpers = helpers
    // TODO REMOVE THIS IS TESTING PURPOSES ONLY:
    // this.run()
  }

  get service() {
    return App.services.Slack
  }

  run = async () => {
    if (this.service.activeChannels) {
      for (const channel of Object.keys(this.service.activeChannels)) {
        const { messages } = await this.service.slack.channels.history({
          channel,
          limit: 1000,
        })
        const links = _.chain(messages)
          .map(message => message.text.match(/\<([a-z]+:\/\/[^>]+)\>/g))
          .filter(Boolean)
          .flatten()
          .value()
        console.log('got links', links)
      }
    }
  }
}
