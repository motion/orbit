import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { uniq, range, sortBy, sample, random } from 'lodash'

@view
class Channel {
  render({ channel }) {
    return (
      <channel $$row>
        <UI.Field row size={1.2} type="toggle" defaultValue={true} />
        <info>
          <UI.Text fontWeight={600} size={1} $name opacity={0.7}>
            #{channel.name}
          </UI.Text>
          <sub $$row>
            <UI.Text>{channel.convos} convos &middot;</UI.Text>
            {channel.people.map((person, index) => (
              <people $$row css={{ alignItems: 'center' }}>
                <UI.Text $mark if={index > 0}>
                  /
                </UI.Text>
                <img
                  css={{ marginTop: 4 }}
                  src={'/images/' + person + '.jpg'}
                  $avatar
                />
                <UI.Text $personName>{person}</UI.Text>
              </people>
            ))}
          </sub>
        </info>
      </channel>
    )
  }

  static style = {
    channel: {
      marginTop: 10,
    },
    avatar: {
      width: 15,
      height: 15,
      borderRadius: 100,
    },
    people: {
      marginLeft: 10,
    },
    person: {
      marginLeft: 5,
    },
    personName: {
      marginLeft: 5,
    },
    mark: {
      marginRight: 5,
    },
    info: {
      marginLeft: 20,
    },
  }
}

const people = ['nate', 'nick', 'steel', 'steph']

@view({
  store: class SlackStore {
    showAll = false
    channels = 'general watercooler office snacks status showoff design tech research ux'
      .split(' ')
      .map(name => ({
        name,
        convos: random(10, 1500),
        people: uniq(range(random(1, 4)).map(() => sample(people))),
      }))
  },
})
export default class Slack {
  render({ store }) {
    const channels = store.showAll
      ? store.channels
      : sortBy(store.channels, 'convos').slice(0, 5)

    return (
      <slack>
        {channels.map(channel => (
          <Channel key={channel.name} channel={channel} />
        ))}

        <buttons $$row>
          <UI.Button
            if={store.channels.length !== channels.length}
            onClick={() => (store.showAll = true)}
            $add
            icon="simple-add"
          >
            show {store.channels.length - channels.length} more
          </UI.Button>
        </buttons>
      </slack>
    )
  }

  static style = {
    buttons: {
      marginTop: 15,
    },
  }
}
