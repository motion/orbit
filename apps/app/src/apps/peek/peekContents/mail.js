import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
// import { Bit } from '@mcro/models'
import * as _ from 'lodash'

@view
export class Mail {
  render({ bit }) {
    if (!bit) {
      return null
    }
    const { messages } = bit.data
    const getHeader = (message, key) =>
      (
        ((message.payload && message.payload.headers) || []).find(
          x => x.name === key,
        ) || {
          value: '',
        }
      ).value
    return (
      <React.Fragment>
        <PeekHeader icon="email" title={bit.title} date={bit.createdAt} />
        <body>
          <messages if={messages}>
            {messages.map((message, index) => {
              return (
                <message key={`${index}${message.id}`}>
                  <row
                    css={{
                      flexFlow: 'row',
                      opacity: 0.7,
                      margin: [0, 0, 6, -15],
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
                        opacity: index === 0 ? 0 : 1,
                        display: 'inline-block',
                        marginTop: 2,
                        marginRight: 8,
                        marginLeft: -6,
                      }}
                    />
                    <rest if={message.payload} $$row $$centered>
                      <strong if={getHeader(message, 'From')}>
                        {getHeader(message, 'From').split(' ')[0]}
                      </strong>&nbsp;
                      <UI.Date
                        if={index !== 0}
                        css={{
                          opacity: 0.6,
                          marginBottom: 2,
                          marginLeft: 3,
                          fontSize: 13,
                        }}
                      >
                        {getHeader(message, 'Date')}
                      </UI.Date>
                    </rest>
                  </row>
                  <UI.Text if={message.snippet} lineHeight={23} size={1.1}>
                    {_.flatten(
                      message.snippet.split('\n').map((i, idx) => (
                        <React.Fragment key={idx}>
                          <p key={idx}>{i}</p>
                          <br />
                        </React.Fragment>
                      )),
                    )}
                  </UI.Text>
                  <pre if={false}>
                    {JSON.stringify(message.payload.headers, 0, 2)}
                  </pre>
                </message>
              )
            })}
          </messages>
        </body>
      </React.Fragment>
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
  }
}
