import * as React from 'react'
import { SlackBitDataMessage } from '@mcro/models'
import { OrbitItemViewProps } from '../../../types'
import { ChatMessage } from '../../../views/bits/chat/ChatMessage'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'

const getMessages = (messages: SlackBitDataMessage[], { shownLimit, searchTerm }) => {
  let res = messages.slice(0, shownLimit)
  if (searchTerm) {
    const filtered = res.filter(m => m.text.indexOf(searchTerm) >= 0)
    if (filtered.length) {
      res = filtered
    }
  }
  return res
}

export function SlackItem(props: OrbitItemViewProps<'slack'>) {
  const { item, searchTerm, shownLimit, extraProps, renderText, hide } = props
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
  if (extraProps && extraProps.oneLine) {
    return <HighlightTextItem>{text.slice(0, 200)}</HighlightTextItem>
  }

  return messages.map((message, index) => {
    for (let person of people || []) {
      message.text = message.text.replace(
        new RegExp(`<@${person.integrationId}>`, 'g'),
        '@' + person.name,
      )
    }
    return (
      <ChatMessage
        key={index}
        {...props}
        message={message}
        previousMessage={data.messages[index - 1]}
        hide={hide}
        extraProps={extraProps}
        renderText={renderText}
      />
    )
  })
}

SlackItem.itemProps = {
  hideTitle: true,
}
