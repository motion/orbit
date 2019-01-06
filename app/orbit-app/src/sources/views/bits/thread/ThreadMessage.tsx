import * as React from 'react'
import { HighlightText } from '../../../../views/HighlightText'
import { AppActions } from '../../../../actions/AppActions'
import { Text } from '@mcro/ui'
import { VerticalSpace, HorizontalSpace } from '../../../../views'
import { RoundButtonBordered } from '../../../../views/RoundButtonBordered'
import { DateFormat } from '../../../../views/DateFormat'
import { gloss } from '@mcro/gloss'

const Message = gloss({
  padding: 15,
  borderBottom: [1, 'dotted', '#eee'],
})

const Paragraph = gloss(HighlightText, {
  marginBottom: '0.35rem',
  userSelect: 'auto',
})

Paragraph.defaultProps = {
  className: 'markdown',
}

const MessageHeader = gloss({
  flexFlow: 'row',
})

const Block = gloss({
  display: 'block',
  '& div': {
    display: 'block',
  },
})

const MailBody = ({ children, ...props }) => (
  <Block className="gmail-body" {...props} dangerouslySetInnerHTML={{ __html: children }} />
)

const openMail = email => () => {
  AppActions.open(`mailto:${email}`)
}

export const ThreadMessage = ({ message }) => {
  return (
    <Message>
      <Text fontWeight={500} size={0.9} alpha={0.8}>
        <DateFormat date={new Date(message.date)} />
      </Text>
      <VerticalSpace small />
      <MessageHeader>
        {message.participants
          .filter(x => x.type === 'from')
          .map(({ name, email }, index) => (
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
      <MailBody>{message.body}</MailBody>
    </Message>
  )
}
