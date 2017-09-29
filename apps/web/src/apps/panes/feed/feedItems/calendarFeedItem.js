import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class CalendarFeedItem {
  getBody(event) {
    const { data } = event
    return <content>{data.summary}</content>
  }

  extraInfo(event) {
    const { data } = event
    return <extra />
  }

  render({ children, event }) {
    const body = this.getBody(event)
    const extraInfo = this.extraInfo(event)
    if (typeof children === 'function') {
      return children({
        body,
        extraInfo,
        verb: event.data.status || 'attended',
        name: event.data.creator.displayName,
        avatar: 'images/me.jpg',
      })
    }
    return body
  }

  static style = {
    content: {
      flex: 1,
      padding: [0, 20],
    },
  }
}
