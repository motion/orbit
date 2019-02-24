import { SlackBitDataMessage } from '@mcro/models'
import { HighlightText } from '@mcro/ui'
import * as React from 'react'
import { ChatMessage } from '../media/ChatMessage'
import { ItemPropsContext } from '../media/ItemPropsContext'
import { OrbitItemViewProps } from '../types/OrbitItemViewProps'

const getMessages = (messages: SlackBitDataMessage[], { shownLimit, searchTerm }) => {
  let res = messages.slice(0, shownLimit)
  if (searchTerm) {
    const filtered = res.filter(m => m.text.includes(searchTerm))
    if (filtered.length) {
      res = filtered
    }
  }
  return res
}

export function ConversationItem(rawProps: OrbitItemViewProps<'slack'>) {
  const itemProps = React.useContext(ItemPropsContext)
  const { item, searchTerm, shownLimit, oneLine, renderText } = { ...itemProps, ...rawProps }
  const { data, people } = item

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

  return messages.map((message, index) => {
    for (let person of people || []) {
      message.text = message.text.replace(
        new RegExp(`<@${person.sourceId}>`, 'g'),
        '@' + person.name,
      )
    }
    return (
      <ChatMessage
        key={index}
        {...rawProps}
        message={message}
        previousMessage={data.messages[index - 1]}
        oneLine={oneLine}
        renderText={renderText}
      />
    )
  })
}

ConversationItem.itemProps = {
  // hideTitle: true,
  // slim: true,
}
