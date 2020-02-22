import { DateFormat, HighlightText, RoundButtonSmall, Space, Text, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { Box, gloss } from 'gloss'
import * as React from 'react'
import ShadowDOM from 'react-shadow'

import { useCaptureLinks } from './Thread'

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

const Message = gloss(Box)

const Paragraph = gloss(HighlightText, {
  className: 'markdown',
  marginBottom: '0.35rem',
  userSelect: 'auto',
})

const MessageHeader = gloss({
  flexDirection: 'row',
})

const Block = gloss({
  display: 'block',
  '& div': {
    display: 'block',
  },
})

const MailBody = ({ children, ...props }) => {
  const rootNode = React.useRef(null)
  const forceUpdate = useForceUpdate()

  // bugfix reactshadow no ref on first render
  React.useEffect(() => {
    if (!rootNode.current) {
      setTimeout(forceUpdate)
    }
  }, [])

  useCaptureLinks(rootNode.current)

  return (
    <View color="#151515" background="#fff" borderRadius={10} overflow="hidden" padding>
      <ShadowDOM.div style={{ pointerEvents: 'inherit' }}>
        <div ref={rootNode}>
          <Block className="gmail-body" {...props} dangerouslySetInnerHTML={{ __html: children }} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              :host {
                all: initial;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif;
              }

              gmail-body {
                user-select: text;
              }

              .gmail-body table {
                table-layout: fixed;
                width: 100%;
              }
              .gmail-body tbody {
                vertical-align: middle;
                border-color: inherit;
              }
              .gmail-body td,
              .gmail-body tr,
              .gmail-body table,
              .gmail-body tbody {
                border-collapse: separate;
                border-spacing: 0px;
                vertical-align: inherit;
              }
              .gmail-body p {
                line-height: 11pt;
              }
            `,
            }}
          />
        </div>
      </ShadowDOM.div>
    </View>
  )
}
