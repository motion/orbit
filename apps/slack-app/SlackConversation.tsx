import { ChatMessage, Col } from '@o/ui'
import React from 'react'

export function SlackConversation(props: { messages: Chat.MeMessage.Params; people?: any }) {
  if (!props.messages) {
    return null
  }
  return (
    <Col space>
      {props.messages.map((message, index) => {
        for (let person of props.people || []) {
          message.text = message.text.replace(
            new RegExp(`<@${person.originalId}>`, 'g'),
            '@' + person.title,
          )
        }
        return (
          <ChatMessage
            key={index}
            {...props}
            message={message}
            previousMessage={props.messages[index - 1]}
          />
        )
      })}
    </Col>
  )
}
