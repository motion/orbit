import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class CalendarFeedItem {
  getBody(event) {
    console.log('event', event)
    return <content>hi</content>
  }

  extraInfo(event) {
    console.log('event', event)
    return 'something'
  }

  render({ children, event }) {
    const body = this.getBody(event)
    const extraInfo = this.extraInfo(event)
    if (typeof children === 'function') {
      return children({
        body,
        extraInfo,
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
