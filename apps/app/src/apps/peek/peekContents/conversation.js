import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import PeekFrame from '../peekFrame'
import * as _ from 'lodash'

@view
export class Conversation {
  render({ bit, selectedItem }) {
    const { messages } = bit.data
    return (
      <PeekFrame>
        <PeekHeader
          if={bit}
          icon="chat"
          title={selectedItem.title}
          date={bit.createdAt}
        />
        <body if={bit}>
          <messages if={messages}>
            {messages.map((message, index) => {
              return (
                <message key={index}>
                  <row>
                    <UI.Icon
                      name="arrows-1_redo"
                      color="#ddd"
                      size={12}
                      $icon
                      css={{ opacity: index === 0 ? 0 : 1 }}
                    />
                    <rest if={message.payload} $$row $$centered>
                      <strong>{message.user}</strong>&nbsp;
                      <UI.Date if={index !== 0} $date>
                        date
                      </UI.Date>
                    </rest>
                  </row>
                  <UI.Text lineHeight={23} size={1.1}>
                    {message.text}
                  </UI.Text>
                </message>
              )
            })}
          </messages>
        </body>
      </PeekFrame>
    )
  }

  static style = {
    body: {
      flex: 1,
      overflowY: 'scroll',
    },
    message: {
      padding: [22, 35],
      borderBottom: [1, 'dotted', '#eee'],
    },
    row: {
      flexFlow: 'row',
      opacity: 0.7,
      margin: [0, 0, 6, -15],
      flex: 1,
      alignItems: 'center',
    },
    date: {
      opacity: 0.6,
      marginBottom: 2,
      marginLeft: 3,
      fontSize: 13,
    },
    icon: {
      display: 'inline-block',
      marginTop: 2,
      marginRight: 8,
      marginLeft: -6,
    },
  }
}
