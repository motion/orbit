import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import { ThreadMessage } from './ThreadMessage'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
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
    return <HighlightTextItem>{bit.body.slice(0, 200)}</HighlightTextItem>
  }
  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
