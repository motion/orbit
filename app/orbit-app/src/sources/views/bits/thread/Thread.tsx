import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import { ThreadMessage } from './ThreadMessage'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
import { OrbitIntegrationProps } from '../../../types'

export const Thread = ({ item, renderText, extraProps }: OrbitIntegrationProps<any>) => {
  if (!item) {
    return null
  }
  const { messages } = item.data as GmailBitData
  if (!messages) {
    return null
  }
  if (renderText) {
    return renderText(item.body)
  }
  if (extraProps && extraProps.oneLine) {
    return <HighlightTextItem>{item.body.slice(0, 200)}</HighlightTextItem>
  }
  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
