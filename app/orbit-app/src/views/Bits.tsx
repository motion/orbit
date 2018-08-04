import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { format, formatDistance } from 'date-fns'
import { Bit } from '@mcro/models'

@view
export class Bits extends React.Component<{ bits: Bit[] }> {
  getTask = task => {
    const { title, id } = task.data
    return {
      key: id,
      primary: title,
      children: [
        <UI.Row>
          <UI.Text>
            {formatDistance(task.data.created_at, Date.now())}{' '}
            {task.data.body.slice(0, 140)}
          </UI.Text>
        </UI.Row>,
      ],
      icon: 'social-github',
    }
  }

  getCalendar = cal => {
    const { summary, start, attendees } = cal.data
    return {
      key: cal.id,
      primary: summary,
      children: [
        <UI.Row>
          <UI.Text lineHeight={20} opacity={0.8}>
            <b>{format(new Date(start.dateTime), 'MM/DD/YYYY')} </b>
            {attendees.map(a => a.displayName || a.email).join(', ')}
          </UI.Text>
        </UI.Row>,
      ],
      icon: 'calendar',
    }
  }

  render() {
    return null
  }
}
