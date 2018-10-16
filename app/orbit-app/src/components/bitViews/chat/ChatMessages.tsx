import * as React from 'react'
import { ChatMessage } from './ChatMessage'
import { SlackBitData, GenericBit } from '@mcro/models'

const idFn = _ => _

export const ChatMessages = ({
  bit,
  processMessage = idFn,
}: {
  bit: GenericBit<'slack'>
  processMessage?: Function
}) => {
  // TODO abstract it into "message" type data
  const messages = (bit.data as SlackBitData).messages
  return (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={processMessage(message)}
          previousMessage={messages[index - 1]}
          bit={bit}
        />
      ))}
    </>
  )
}
