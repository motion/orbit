import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import * as _ from 'lodash'
import * as Helpers from '../../../../helpers'
import { PeekPaneProps } from '../../PeekPaneProps'

const parseBody = body =>
  !body ? '' : atob(body.replace(/-/g, '+').replace(/_/g, '/'))

const Message = view({
  padding: [22, 35],
  borderBottom: [1, 'dotted', '#eee'],
})

const Para = view({
  marginBottom: '0.35rem',
})

@view
export class Mail extends React.Component<PeekPaneProps> {
  render() {
    const { bit, children } = this.props
    if (!bit || !bit.data) {
      return children({})
    }
    const { messages } = bit.data
    return children({
      icon: 'email',
      title: bit.title,
      date: bit.createdAt,
      content: messages ? (
        <div>
          {messages.map((message, index) => {
            return (
              <Message key={`${index}${message.id}`}>
                <UI.Row
                  css={{
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
                  <UI.Row
                    if={message.payload}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {Helpers.getHeader(message, 'From') && (
                      <strong>
                        {Helpers.getHeader(message, 'From').split(' ')[0]}&nbsp;
                      </strong>
                    )}
                    <UI.Date
                      if={index !== 0}
                      css={{
                        opacity: 0.6,
                        marginBottom: 2,
                        marginLeft: 3,
                        fontSize: 13,
                      }}
                    >
                      {Helpers.getHeader(message, 'Date')}
                    </UI.Date>
                  </UI.Row>
                </UI.Row>
                <UI.Text if={message.snippet} size={1.1}>
                  {_.flatten(
                    (parseBody(message.payload.body.data) || message.snippet)
                      .split('\n')
                      .map((i, idx) => <Para key={idx}>{i}</Para>),
                  )}
                </UI.Text>
              </Message>
            )
          })}
        </div>
      ) : null,
    })
  }
}
