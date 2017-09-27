// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import typeof { Event } from '@mcro/models'
import FeedItem from './feedItem'

type Props = { data: Object, activeIndex: number, items: Array<Event> }

@view.ui
export default class Feed extends React.PureComponent<Props> {
  render({ items, data }: Props) {
    return (
      <feed $inApp={data.special}>
        <UI.Title opacity={0.5} marginBottom={10}>
          Recently ({items.length})
        </UI.Title>
        {items.map(event => <FeedItem key={event.id} event={event} />)}
      </feed>
    )
  }

  static style = {
    feed: {
      flex: 1,
      position: 'relative',
    },
    inApp: {
      padding: [10, 15],
    },
    unpad: {
      margin: [0, -15],
    },
  }
}
