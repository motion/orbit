import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { DateFormat } from '../../../../views/DateFormat'
import { RoundButtonBordered } from '../../../../views/RoundButtonBordered'
import { Actions } from '../../../../actions/Actions'
import { VerticalSpace } from '../../../../views'
import { HighlightText } from '../../../../views/HighlightText'

const HorizontalSpace = view({
  width: 10,
})

const Message = view({
  padding: 15,
  borderBottom: [1, 'dotted', '#eee'],
})

const Paragraph = view(HighlightText, {
  marginBottom: '0.35rem',
  userSelect: 'auto',
})

Paragraph.defaultProps = {
  className: 'markdown',
}

const MessageHeader = view({
  flexFlow: 'row',
})

const Block = view({
  display: 'block',
  '& div': {
    display: 'block',
  },
})

const GmailBody = ({ children, ...props }) => (
  <Block className="gmail-body" {...props} dangerouslySetInnerHTML={{ __html: children }} />
)

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
              {message.participants.filter(x => x.type === 'from').map(({ name, email }, index) => (
                <React.Fragment key={index}>
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
                </React.Fragment>
              ))}
            </MessageHeader>
            <VerticalSpace small />
            <GmailBody>{message.body}</GmailBody>
          </Message>
        )
      })}
    </div>
  )
}
