import * as React from 'react'

import { Bit } from '../helpers/BitLike'
import { Stack } from '../View/Stack'
import { ChatMessage } from './ChatMessage'

export function ChatMessages({ messages, people }: { messages: ChatMessage[]; people?: Bit[] }) {
  return (
    <Stack space="sm">
      {(messages || []).map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          previousMessage={messages[index - 1]}
          people={people}
        />
      ))}
    </Stack>
  )
}
