import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, on } from '@mcro/black'
import { fuzzy } from '../../../../helpers'
import * as _ from 'lodash'
import { SlackChannel } from './slackPanes/SlackChannel'
import { SettingPaneProps } from './SettingPaneProps'

class SlackSettingStore {
  search = ''
  hasShown = false

  get service() {
    return this.props.appStore.services.slack
  }

  didMount() {
    on(
      this,
      setTimeout(() => {
        this.hasShown = true
      }),
    )
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
@view.attach({
  store: SlackSettingStore,
})
@view
export class SlackSetting extends React.Component<
  SettingPaneProps & {
    store: SlackSettingStore
  }
> {
  render() {
    const { store, setting, children } = this.props
    if (!setting) {
      return null
    }
    return children({
      content: (
        <UI.Col flex={1}>
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
          <UI.Col if={store.service} flex={1}>
            <UI.List
              if={store.hasShown}
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
          </UI.Col>
        </UI.Col>
      ),
    })
  }
}
