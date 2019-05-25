import { Box, gloss } from 'gloss'
import * as React from 'react'

import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { Space } from '../Space'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { Text } from '../text/Text'

export type ThreadMessageLike = {
  body?: string
  participants: { name: string; email: string; type: 'to' | 'from' }[]
  date: number
}

export function ThreadMessage({ date, participants, body }: ThreadMessageLike) {
  return (
    <Message>
      <Text fontWeight={500} size={0.9} alpha={0.8}>
        <DateFormat date={new Date(date)} />
      </Text>
      <Space />
      <MessageHeader>
        {participants
          .filter(x => x.type === 'from')
          .map(({ name, email }, index) => (
            <React.Fragment key={index}>
              <RoundButtonSmall
                key={index}
                // onClick={openMail(email)}
                tooltip={email}
                tooltipProps={{
                  noHoverOnChildren: false,
                }}
              >
                {name}
              </RoundButtonSmall>
              <Space />
            </React.Fragment>
          ))}
      </MessageHeader>
      <Space />
      <MailBody>{body}</MailBody>
    </Message>
  )
}

const Message = gloss(Box, {
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
