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
    return (
      <slack>
        <UI.Input
          marginBottom={10}
          size={1.2}
          placeholder="Filter Channels..."
          onChange={e => (store.search = e.target.value)}
          value={store.search}
        />
        <UI.List
          itemsKey={store.search}
          virtualized={{
            measure: true,
          }}
          items={store.channels}
          getItem={channel => (
            <SlackChannel key={channel.id} channel={channel} />
          )}
        />
      </slack>
    )
  }

  static style = {
    slack: {
      padding: 10,
      flex: 1,
    },
    buttons: {
      marginTop: 15,
    },
  }
}

@view
class SlackChannel {
  render({ channel }) {
    return (
      <channel $$row>
        <info>
          <UI.Text fontWeight={600} size={1} $name opacity={0.7}>
            #{channel.name}
          </UI.Text>
          <sub $$row>
            <UI.Text>{channel.convos} convos &middot;</UI.Text>
            {(channel.members || []).map((member, index) => (
              <members $$row css={{ alignItems: 'center' }}>
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
        <UI.Field row size={1.2} type="toggle" defaultValue={false} />
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
