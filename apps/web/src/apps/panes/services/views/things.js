import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { capitalize } from 'lodash'
import { format, formatDistance } from 'date-fns'

@view
export default class Things {
  getTask = task => {
    const { title, id } = task.data

    return {
      key: id,
      primary: title,
      children: [
        <items $$row>
          <UI.Text>
            {formatDistance(task.data.created_at, Date.now())}{' '}
            {task.data.body.slice(0, 140)}
          </UI.Text>
        </items>,
      ],
      icon: 'social-github',
    }
  }

  getCalendar = cal => {
    const { summary, start, attendees } = cal.data
    console.log('start is', start)

    return {
      key: cal.id,
      primary: summary,
      children: [
        <items $$row>
          <UI.Text lineHeight={20} opacity={0.8}>
            <b>{format(new Date(start.dateTime), 'MM/DD/YYYY')} </b>
            {attendees.map(a => a.displayName || a.email).join(', ')}
          </UI.Text>
        </items>,
      ],
      icon: 'calendar',
    }
  }

  render({ things }) {
    return (
      <things>
        <items>
          <UI.List
            itemProps={{
              fontSize: 18,
              padding: [8, 15],
              iconSize: 18,
            }}
            items={things}
            getItem={thing => this['get' + capitalize(thing.type)](thing)}
          />
        </items>
      </things>
    )
  }

  static style = {
    things: {
      maxHeight: 300,
      overflow: 'scroll',
    },
    items: {
      margin: [10],
    },
  }
}
