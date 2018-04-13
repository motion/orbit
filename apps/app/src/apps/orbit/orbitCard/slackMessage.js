import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@view
export default class SlackMessage {
  render({ bit, message }) {
    if (!message.text) {
      return null
    }
    if (message.text.indexOf('uploaded a file') >= 0) {
      const src = message.text.match(/\<([a-z]+:\/\/[^>]+)\>/g).map(link =>
        link
          .slice(1, link.length)
          .slice(0, link.length - 2)
          .replace(/\|.*$/g, ''),
      )[0]
      console.log('src', src)
      return (
        <div $$flex>
          image
          <img src={src} css={{ maxWidth: '100%' }} />
        </div>
      )
    }
    return (
      <message>
        <UI.Text ellipse={15}>
          <user>
            <strong>{message.user}</strong>
            &nbsp;&nbsp;
            <UI.Date $date>{new Date(message.ts.split('.')[0] * 1000)}</UI.Date>
          </user>
          <content>{message.text} </content>
        </UI.Text>
      </message>
    )
  }
  static style = {
    message: {
      padding: [10, 0, 0],
    },
    user: {
      fontSize: 13,
      flexFlow: 'row',
    },
    strong: {
      fontWeight: 600,
      color: '#000',
    },
    date: {
      fontSize: 12,
      fontWeight: 300,
      opacity: 0.5,
    },
  }
}
