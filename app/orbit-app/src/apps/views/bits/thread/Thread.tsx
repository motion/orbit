import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import { ThreadMessage } from './ThreadMessage'

export const Thread = ({ bit }) => {
  if (!bit) {
    return null
  }
  const { messages } = bit.data as GmailBitData
  if (!messages) {
    return null
  }
  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
