import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { fuzzy } from '~/helpers'
import App from '~/app'

@view({
  store: class SlackStore {
    search = ''
    get channels() {
      return fuzzy(App.services.Slack.allChannels || [], this.search, {
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
    buttons: {
      marginTop: 15,
    },
  }
}

@view
class SlackChannel extends React.Component {
  onChange = val => {
    const { Slack } = App.services
    Slack.setting.mergeUpdate({
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
      <channel $$row>
        <info>
          <UI.Text fontWeight={600} size={1} $name opacity={0.7}>
            #{channel.name}
          </UI.Text>
          <sub $$row>
            <UI.Text>{channel.convos} convos &middot;</UI.Text>
            {(channel.members || []).map((member, index) => (
              <members key={member} $$row css={{ alignItems: 'center' }}>
                <UI.Text $mark if={index > 0}>
                  /
                </UI.Text>
                <img
                  css={{ marginTop: 4 }}
                  src={'/images/' + member + '.jpg'}
                  $avatar
                />
                <UI.Text $memberName>{member}</UI.Text>
              </members>
            ))}
          </sub>
        </info>
        <UI.Field
          row
          size={1.2}
          type="toggle"
          defaultValue={channels[channel.id]}
          onChange={this.onChange}
        />
      </channel>
    )
  }

  static style = {
    channel: {
      padding: [10, 15],
    },
    avatar: {
      width: 15,
      height: 15,
      borderRadius: 100,
    },
    members: {
      marginLeft: 10,
    },
    member: {
      marginLeft: 5,
    },
    memberName: {
      marginLeft: 5,
    },
    mark: {
      marginRight: 5,
    },
    info: {
      flex: 1,
    },
  }
}
