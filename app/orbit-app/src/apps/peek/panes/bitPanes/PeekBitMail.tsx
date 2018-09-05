import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import Linkify from 'react-linkify'
import { DateFormat } from '../../../../views/DateFormat'
import { RoundButtonBordered } from '../../../../views/RoundButtonBordered'
import { Actions } from '../../../../actions/Actions'
import { VerticalSpace } from '../../../../views'

const HorizontalSpace = view({
  width: 10,
})

const Message = view({
  padding: 15,
  borderBottom: [1, 'dotted', '#eee'],
})

const Para = view({
  marginBottom: '0.35rem',
  whiteSpace: 'normal',
})

const MessageHeader = view({
  flexFlow: 'row',
})

const openMail = email => () => {
  Actions.open(`mailto:${email}`)
}

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
            <UI.Text fontWeight={500} size={0.9} alpha={0.8}>
              <DateFormat date={new Date(message.date)} />
            </UI.Text>
            <VerticalSpace small />
            <MessageHeader>
              {message.participants
                .filter(x => x.type === 'from')
                .map(({ name, email }, index) => (
                  <>
                    <RoundButtonBordered
                      key={index}
                      onClick={openMail(email)}
                      tooltip={email}
                      tooltipProps={{
                        noHoverOnChildren: false,
                      }}
                    >
                      {name}
                    </RoundButtonBordered>
                    <HorizontalSpace />
                  </>
                ))}
            </MessageHeader>
            <VerticalSpace small />
            <Linkify>
              {!!message.body && (
                <UI.Text>
                  {message.body.split('\n\n').map((message, idx) => (
                    <Para className="markdown" key={idx}>
                      {message}
                    </Para>
                  ))}
                </UI.Text>
              )}
            </Linkify>
          </Message>
        )
      })}
    </div>
  )
}
