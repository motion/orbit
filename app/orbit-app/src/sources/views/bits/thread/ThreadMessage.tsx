import { gloss } from '@mcro/gloss'
import { Text } from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../../../../actions/appActions/AppActions'
import { HorizontalSpace, VerticalSpace } from '../../../../views'
import { DateFormat } from '../../../../views/DateFormat'
import { HighlightText } from '../../../../views/HighlightText'
import { RoundButtonBordered } from '../../../../views/RoundButtonBordered'

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
  <Text>
    <Block className="gmail-body" {...props} dangerouslySetInnerHTML={{ __html: children }} />
  </Text>
)

const openMail = email => () => {
  AppActions.open(`mailto:${email}`)
}

export function ThreadMessage({ message }) {
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
