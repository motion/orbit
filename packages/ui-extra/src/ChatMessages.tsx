import { Bit, ChatMessage, Stack } from '@o/ui'
import * as React from 'react'

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
