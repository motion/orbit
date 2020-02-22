import { Stack } from '@o/ui'
import * as React from 'react'

import { ChatMessage } from './ChatMessage'

export function ChatMessages({ messages, people }: { messages: ChatMessage[]; people?: any[] }) {
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
