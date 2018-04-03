import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import PeekFrame from '../peekFrame'
// import { Bit } from '@mcro/models'

@view
export class Mail {
  render({ bit, selectedItem }) {
    if (!bit) {
      return null
    }
    const { messages } = bit.data
    const getHeader = (message, key) =>
      (
        (message.payload.headers || []).find(x => x.name === key) || {
          value: '',
        }
      ).value
    return (
      <PeekFrame>
        <PeekHeader
          icon="email"
          title={selectedItem.title}
          date={bit.createdAt}
        />
        <body>
          <messages if={messages}>
            {messages.map(message => {
              return (
                <message key={message.id}>
                  <row
                    css={{
                      flexFlow: 'row',
                      opacity: 0.5,
                      margin: [0, 0, 10, 0],
                      flex: 1,
                      alignItems: 'center',
                      // justifyContent: 'center',
                    }}
                  >
                    <UI.Icon
                      name="arrows-1_redo"
                      color="#ddd"
                      size={12}
                      css={{
                        display: 'inline-block',
                        marginTop: 2,
                        marginRight: 6,
                      }}
                    />{' '}
                    <rest $$row>
                      from {getHeader(message, 'From').split(' ')[0]}&nbsp;
                      <UI.Date>{getHeader(message, 'Date')}</UI.Date>
                    </rest>
                  </row>
                  <UI.Text lineHeight={20} size={1.1}>
                    {message.snippet}
                  </UI.Text>
                  <pre if={false}>
                    {JSON.stringify(message.payload.headers, 0, 2)}
                  </pre>
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
      padding: 20,
      borderBottom: [1, 'dotted', '#eee'],
    },
  }
}
