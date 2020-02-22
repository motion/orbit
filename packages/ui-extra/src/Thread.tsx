import { HighlightText, Stack, UIConfig } from '@o/ui'
import * as React from 'react'

import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'
import { ThreadMessage, ThreadMessageLike } from './ThreadMessage'

export type ThreadLike = {
  body: string
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
    <Stack space>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} {...message} />
      })}
    </Stack>
  )
}

// copied from orbit-app, TODO unfiy
export const useCaptureLinks = (node: any) => {
  // capture un-captured links
  // if you don't then clicking a link will cause electron to go there
  // this is a good safeguard
  React.useEffect(() => {
    if (!node) return
    const onClickLink = event => {
      let i = 0
      let cur = event.target
      let found
      // find the ancestor link
      while (cur && !found && i < 100) {
        i++
        if (cur.tagName === 'A') {
          found = cur
        } else {
          cur = cur.parentNode
        }
      }
      if (found) {
        UIConfig.handleLink(event, found.href)
      }
    }
    node.addEventListener('click', onClickLink)
    return () => {
      node.removeEventListener('click', onClickLink)
    }
  }, [node])
}
