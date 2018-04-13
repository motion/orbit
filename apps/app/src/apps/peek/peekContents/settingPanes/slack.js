import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { fuzzy } from '~/helpers'
import { SlackService } from '@mcro/models/services'
import * as _ from 'lodash'
import SlackChannel from './slackChannel'

@view({
  store: class SlackStore {
    search = ''
    service = new SlackService(this.props.appStore.settings.slack)

    get sortedChannels() {
      return _.orderBy(
        this.service.allChannels || [],
        ['is_private', 'num_members'],
        ['asc', 'desc'],
      )
    }

    get channels() {
      this.service.setting.values
      return fuzzy(this.search, this.sortedChannels, {
        keys: 'name',
      })
    }
  },
})
export default class Slack {
  render({ store }) {
    return (
      <slack>
        <UI.Input
          marginBottom={10}
          sizeRadius
          size={1.1}
          placeholder="Filter Channels..."
          onChange={e => (store.search = e.target.value)}
          value={store.search}
        />
        <content>
          <UI.List
            scrollable
            itemsKey={store.search + store.channels && store.channels.length}
            items={store.channels}
            getItem={channel => (
              <SlackChannel
                key={channel.id}
                channel={channel}
                slackService={store.service}
              />
            )}
          />
        </content>
      </slack>
    )
  }

  static style = {
    slack: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
  }
}
