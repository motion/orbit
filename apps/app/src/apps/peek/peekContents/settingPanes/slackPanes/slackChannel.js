import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@view
export class SlackChannel extends React.Component {
  version = 0

  get setting() {
    return this.props.slackService.setting
  }

  async onChange(val) {
    console.log('changing', val)
    this.setting.values = {
      ...this.setting.values,
      channels: {
        ...this.setting.values.channels,
        [this.props.channel.id]: val,
      },
    }
    await this.setting.save()
    console.log('saved')
    this.version++
  }

  render() {
    const { channel, slackService } = this.props
    if (!slackService.setting) {
      return null
    }
    const { channels = {} } = slackService.setting.values
    return (
      <div $channel>
        <div $info>
          <UI.Text $title fontWeight={500} size={1.2}>
            #{channel.name} <span>({channel.num_members} Members)</span>
          </UI.Text>
          <UI.Text $description ellipse={1} size={1.1} opacity={0.6}>
            {channel.topic && channel.topic.value}
          </UI.Text>
        </div>
        <div $options>
          <UI.Field
            size={1.2}
            type="toggle"
            value={channels[channel.id]}
            onChange={val => this.onChange(val)}
          />
        </div>
      </div>
    )
  }

  static style = {
    channel: {
      flex: 1,
      flexFlow: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      padding: [5, 0],
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
      width: 40,
      marginLeft: 20,
    },
  }
}
