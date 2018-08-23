import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { TimeAgo } from '../../../../views/TimeAgo'

const Message = view({
  padding: [22, 35],
  borderBottom: [1, 'dotted', '#eee'],
})

const Para = view({
  marginBottom: '0.35rem',
})

export const Mail = ({ bit }: PeekBitPaneProps) => {
  const { messages } = bit.data as GmailBitData
  if (!messages) {
    debugger
    return null
  }
  return (
    <div>
      {messages
        // im seeing messages with no body
        .filter(message => !!message.body)
        .map((message, index) => {
          return (
            <Message key={`${index}${message.id}`}>
              <UI.Row
                {...{
                  opacity: 0.7,
                  margin: [0, 0, 6, -15],
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <UI.Icon
                  name="arrows-1_redo"
                  color="#ddd"
                  size={12}
                  opacity={index === 0 ? 0 : 1}
                  marginTop={2}
                  marginRight={8}
                  marginLeft={-6}
                />
                <UI.Row alignItems="center" justifyContent="center">
                  {message.participants
                    .filter(x => x.type === 'from')
                    .map(({ name, email }, index) => (
                      <a key={index} href={`mailto:${email}`}>
                        <strong>{name}</strong>&nbsp;
                      </a>
                    ))}
                  {index !== 0 && (
                    <UI.View
                      style={{
                        opacity: 0.6,
                        marginBottom: 2,
                        marginLeft: 3,
                        fontSize: 13,
                      }}
                    >
                      <TimeAgo>{message.date}</TimeAgo>
                    </UI.View>
                  )}
                </UI.Row>
              </UI.Row>
              {!!message.body && (
                <UI.Text>
                  {message.body
                    .split('\n')
                    .map((i, idx) => <Para key={idx}>{i}</Para>)}
                </UI.Text>
              )}
            </Message>
          )
        })}
    </div>
  )
}
