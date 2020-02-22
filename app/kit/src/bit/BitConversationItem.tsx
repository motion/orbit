import { HighlightText, ListItemViewProps } from '@o/ui'
import { ChatMessage, ItemPropsContext } from '@o/ui-extra'
import React, { useContext } from 'react'

const getMessages = (messages: any[], { shownLimit, searchTerm }) => {
  // todo: fix any type
  let res = messages.slice(0, shownLimit)
  if (searchTerm) {
    const filtered = res.filter(m => m.text.includes(searchTerm))
    if (filtered.length) {
      res = filtered
    }
  }
  return res
}

export function ConversationItem(props: ListItemViewProps) {
  const { oneLine, renderText } = useContext(ItemPropsContext)
  const { searchTerm, shownLimit } = props
  const { data, people } = props.item

  if (!data || !data.messages) {
    return null
  }

  const messages = getMessages(data.messages, { searchTerm, shownLimit })

  // one line view
  const text = messages.map(message => message.text).join(' ')

  if (renderText) {
    return renderText(text)
  }
  if (oneLine) {
    return <HighlightText ellipse>{text.slice(0, 200)}</HighlightText>
  }

  return (
    <>
      {messages.map((message, index) => {
        for (let person of people || []) {
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
            previousMessage={data.messages[index - 1]}
            oneLine={oneLine}
            renderText={renderText}
          />
        )
      })}
    </>
  )
}
