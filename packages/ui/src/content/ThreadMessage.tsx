import { Box, gloss } from 'gloss'
import * as React from 'react'

import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { HighlightText } from '../Highlight'
import { Space } from '../Space'
import { DateFormat } from '../text/DateFormat'
import { Text } from '../text/Text'
import { View } from '../View/View'

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
      <MailBody>{body}</MailBody>
    </Message>
  )
}

const Message = gloss(Box).theme(theme => ({
  borderBottom: [1, theme.borderColor],
}))

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

const MailBody = ({ children, ...props }) => {
  return (
    <View color="#151515" background="#fff" borderRadius={10} overflow="hidden">
      <Block className="gmail-body" {...props} dangerouslySetInnerHTML={{ __html: children }} />
    </View>
  )
}
