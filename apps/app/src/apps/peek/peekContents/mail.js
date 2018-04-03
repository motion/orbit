import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
// import { Bit } from '@mcro/models'

@view
export class Mail {
  render({ bit, selectedItem }) {
    if (!bit) {
      return null
    }
    const { messages } = bit.data
    return (
      <content>
        <PeekHeader title={selectedItem.title} date={bit.createdAt} />
        <body>
          <message>
            <UI.Text size={1.2}>{bit.body}</UI.Text>
          </message>
          <messages if={messages}>
            {messages.map(message => {
              return (
                <message key={message.id}>
                  <UI.Text>{message.snippet}</UI.Text>
                </message>
              )
            })}
          </messages>
        </body>
      </content>
    )
  }

  static style = {
    content: {
      overflowY: 'scroll',
      flex: 1,
    },
    body: {
      flex: 1,
      overflowY: 'scroll',
    },
    message: {
      padding: 20,
      borderBottom: [1, 'dotted', '#eee'],
    },
  }
}
