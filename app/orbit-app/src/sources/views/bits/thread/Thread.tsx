import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import { ThreadMessage } from './ThreadMessage'
import { HighlightText } from '../../../../views/HighlightText'
import { OrbitIntegrationProps } from '../../../types'

export const Thread = ({ bit, renderText, extraProps }: OrbitIntegrationProps<any>) => {
  if (!bit) {
    return null
  }
  const { messages } = bit.data as GmailBitData
  if (!messages) {
    return null
  }
  if (renderText) {
    return renderText(bit.body)
  }
  if (extraProps && extraProps.oneLine) {
    return <HighlightText>{bit.body}</HighlightText>
  }
  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
