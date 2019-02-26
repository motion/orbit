import * as React from 'react'
import { ChatMessage } from './ChatMessage'

export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  if (!messages) {
    return null
  }
  return (
    <>
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} previousMessage={messages[index - 1]} />
      ))}
    </>
  )
}
