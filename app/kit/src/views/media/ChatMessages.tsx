import { GenericBit, SlackBitData } from '@mcro/models'
import * as React from 'react'
import { ChatMessage } from './ChatMessage'

const idFn = _ => _

export function ChatMessages({
  item,
  processMessage = idFn,
}: {
  item: GenericBit<'slack'>
  processMessage?: Function
}) {
  // TODO abstract it into "message" type data
  const messages = (item.data as SlackBitData).messages
  if (!messages) {
    return null
  }
  return (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={processMessage(message)}
          previousMessage={messages[index - 1]}
          item={item}
        />
      ))}
    </>
  )
}
