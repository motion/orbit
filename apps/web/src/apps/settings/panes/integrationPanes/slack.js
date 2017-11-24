import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { fuzzy } from '~/helpers'
import App from '~/app'
import * as _ from 'lodash'

@view({
  store: class SlackStore {
    search = ''

    get sortedChannels() {
      return _.orderBy(
        App.services.Slack.allChannels || [],
        ['is_private', 'num_members'],
        ['asc', 'desc']
      )
    }

    get channels() {
      return fuzzy(this.sortedChannels, this.search, {
        keys: ['name'],
      })
    }
  },
})
export default class Slack {
  render({ store }) {
    // virtualized={{
    //   measure: true,
    // }}
    return (
      <slack>
        <UI.Input
          marginBottom={10}
          size={1.2}
          placeholder="Filter Channels..."
          onChange={e => (store.search = e.target.value)}
          value={store.search}
        />
        <content>
          <UI.List
            itemsKey={store.search}
            items={store.channels}
            getItem={channel => (
              <SlackChannel key={channel.id} channel={channel} />
            )}
          />
        </content>
      </slack>
    )
  }

  static style = {
    slack: {
      padding: 10,
      flex: 1,
    },
    content: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}

@view
class SlackChannel extends React.Component {
  onChange = val => {
    App.services.Slack.setting.mergeUpdate({
      values: {
        channels: {
          [this.props.channel.id]: val,
        },
      },
    })
  }

  render({ channel }) {
    const { Slack } = App.services
    const { channels = {} } = Slack.setting.values
    return (
      <channel>
        <info>
          <UI.Text $title fontWeight={600} size={1.2}>
            #{channel.name} <span>({channel.num_members} Members)</span>
          </UI.Text>
          <UI.Text $description ellipse size={1.1} opacity={0.6}>
            {channel.topic.value}
          </UI.Text>
        </info>
        <options>
          <UI.Field
            size={1.2}
            type="toggle"
            value={channels[channel.id]}
            onChange={this.onChange}
          />
        </options>
      </channel>
    )
  }

  static style = {
    channel: {
      flex: 1,
      flexFlow: 'row',
      maxWidth: '100%',
      overflow: 'hidden',
      alignItems: 'center',
      padding: [5, 10],
    },
    span: {
      fontWeight: 300,
      fontSize: '80%',
    },
    info: {
      flex: 1,
      overflow: 'hidden',
    },
    options: {
      flexFlow: 'row',
      flexShrink: 0,
    },
  }
}
