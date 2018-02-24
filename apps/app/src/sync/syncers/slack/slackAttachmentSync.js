// @flow
import App, { Thing } from '~/app'
import * as _ from 'lodash'
import * as r2 from '@mcro/r2'
import { createInChunks } from '~/sync/helpers'
import * as Constants from '~/constants'

const log = debug('sync')

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

  get lastSync() {
    return this.setting.values.lastAttachmentSync || {}
  }

  run = async () => {
    console.log('Running slack sync')
    if (this.service.activeChannels) {
      for (const channel of Object.keys(this.service.activeChannels)) {
        const oldestSynced = this.lastSync[channel]
        const info = await this.service.slack.channels.info({ channel })
        const messages = await this.service.channelHistory({
          channel,
          oldest: oldestSynced,
          count: 2000,
        })
        console.log('got messages', messages)
        const links = _.chain(messages)
          .map(message => message.text.match(/\<([a-z]+:\/\/[^>]+)\>/g))
          .filter(Boolean)
          .flatten()
          // remove the <wrapping-things>
          .map(link =>
            link
              .slice(1, link.length)
              .slice(0, link.length - 2)
              .replace(/\|.*$/g, ''),
          )
          .value()

        if (!links.length) {
          log('No links found')
          return
        }

        try {
          if (links && links.length) {
            // crawl 20 at a time
            for (const entries of _.chunk(links, 10)) {
              console.log('crawling chunk', entries)
              const { results } = await r2.post(
                `${Constants.API_URL}/crawler/exact`,
                {
                  json: {
                    options: { entries },
                  },
                },
              ).json
              console.log('got results', results)
              if (results && results.length) {
                // create in 10 at at time (default chunk)
                const created = await createInChunks(results, result =>
                  Thing.create(
                    Thing.fromCrawl({
                      ...result,
                      integration: 'slack',
                      data: {
                        channelId: channel,
                        channel: info.channel.name_normalized,
                      },
                    }),
                  ),
                )
                console.log('created', created)
              }
            }
          }

          // write last sync
          const oldestSyncedTime = messages[messages.length - 1].ts
          console.log('oldestSyncedTime', oldestSyncedTime)
          await this.setting.mergeUpdate({
            values: {
              lastAttachmentSync: {
                [channel]: oldestSyncedTime,
              },
            },
          })
        } catch (err) {
          log(`Error crawling results ${err.message}\n${err.stack}`)
        }
      }
    }
  }
}
