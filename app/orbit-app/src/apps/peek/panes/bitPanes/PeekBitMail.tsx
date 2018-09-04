import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import Linkify from 'react-linkify'
import { DateFormat } from '../../../../views/DateFormat'

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
    return null
  }
  return (
    <div>
      {messages.map((message, index) => {
        return (
          <Message key={`${index}${message.id}`}>
            <UI.View>
              <UI.Icon
                name="arrowsredo"
                color="#ddd"
                size={12}
                opacity={index === 0 ? 0 : 1}
                marginTop={2}
                marginRight={8}
                marginLeft={-6}
              />
              <UI.Text>
                {message.participants
                  .filter(x => x.type === 'from')
                  .map(({ name, email }, index) => (
                    <a key={index} href={`mailto:${email}`}>
                      <strong>{name}</strong>
                      &nbsp;
                    </a>
                  ))}
              </UI.Text>
              <UI.Text fontWeight={500} size={0.95}>
                <DateFormat date={new Date(message.date)} />
              </UI.Text>
            </UI.View>
            {!!message.body && (
              <UI.Text>
                {message.body.split('\n').map((message, idx) => (
                  <Para className="markdown" key={idx}>
                    <Linkify>{message}</Linkify>
                  </Para>
                ))}
              </UI.Text>
            )}
          </Message>
        )
      })}
    </div>
  )
}
