import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@view
export default class SlackChannel {
  onChange = val => {
    this.props.slackService.setting.mergeUpdate({
      values: {
        channels: {
          [this.props.channel.id]: val,
        },
      },
    })
  }

  render({ channel, slackService }) {
    const { channels = {} } = slackService.setting.values
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
