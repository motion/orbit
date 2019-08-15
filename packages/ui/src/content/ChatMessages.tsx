import * as React from 'react'

import { Bit } from '../helpers/BitLike'
import { Col } from '../View/Col'
import { ChatMessage } from './ChatMessage'

export function ChatMessages({ messages, people }: { messages: ChatMessage[]; people?: Bit[] }) {
  return (
    <Col space>
      {(messages || []).map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          previousMessage={messages[index - 1]}
          people={people}
        />
      ))}
    </Col>
  )
}
