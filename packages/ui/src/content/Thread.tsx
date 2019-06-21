import * as React from 'react'

import { HighlightText } from '../text/HighlightText'
import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'
import { ThreadMessage, ThreadMessageLike } from './ThreadMessage'

export type ThreadLike = {
  body?: string
  messages: ThreadMessageLike[]
}

export type ThreadProps = ThreadLike & Partial<ItemsPropsContextType>

export function Thread(rawProps: ThreadProps) {
  const itemProps = React.useContext(ItemPropsContext)
  const { oneLine, messages, body, renderText } = { ...itemProps, ...rawProps }
  if (!messages) {
    return null
  }
  if (renderText) {
    return renderText(body)
  }
  if (oneLine) {
    return <HighlightText ellipse>{body.slice(0, 200)}</HighlightText>
  }
  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} {...message} />
      })}
    </div>
  )
}
