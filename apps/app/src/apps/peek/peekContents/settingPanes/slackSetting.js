import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { fuzzy } from '~/helpers'
import * as _ from 'lodash'
import { SlackChannel } from './slackPanes/slackChannel'

class SlackSettingStore {
  search = ''

  get service() {
    return this.props.appStore.services.slack
  }

  willUnmount() {
    this.service.dispose()
  }

  get sortedChannels() {
    return _.orderBy(
      this.service.allChannels || [],
      ['is_private', 'num_members'],
      ['asc', 'desc'],
    )
  }

  get channels() {
    return fuzzy(this.search, this.sortedChannels, {
      key: 'name',
    })
  }
}

@view.attach('appStore')
@view({
  store: SlackSettingStore,
})
export class SlackSetting extends React.Component {
  render({ store, setting }) {
    return (
      <slack if={setting}>
        <UI.Input
          marginBottom={10}
          sizeRadius
          size={1.1}
          borderColor="#ccc"
          background="#fff"
          placeholder="Filter Channels..."
          onChange={e => (store.search = e.target.value)}
          value={store.search}
        />
        <content if={store.service}>
          <UI.List
            scrollable
            height="100%"
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
