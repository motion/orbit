// @flow
import App, { Thing } from '~/app'
import { createInChunks } from '~/sync/helpers'
import debug from 'debug'
import * as _ from 'lodash'
import * as r2 from '@mcro/r2'

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
          // remove the <wrapping-things>
          .map(link =>
            link
              .slice(1, link.length)
              .slice(0, link.length - 2)
              .replace(/\|.*$/g, '')
          )
          .value()
        console.log('got links', links)
        if (links.length) {
          const results = await r2.post('http://localhost:3001/crawler/exact', {
            json: {
              options: {
                entries: links,
              },
            },
          }).json
          console.log('got results', results)
        }
      }
    }
  }
}
