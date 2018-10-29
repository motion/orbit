import * as React from 'react'
import { SlackBitDataMessage } from '@mcro/models'
import { OrbitIntegrationProps } from '../../../types'
import { ChatMessage } from '../../../views/bits/chat/ChatMessage'
import { HighlightText } from '../../../../views/HighlightText'

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

export class SlackItem extends React.Component<OrbitIntegrationProps<'slack'>> {
  render() {
    const { bit, searchTerm, shownLimit, extraProps, hide } = this.props
    if (!bit) {
      return null
    }
    const { data, people } = bit
    if (extraProps && extraProps.minimal) {
      return <HighlightText>{bit.body}</HighlightText>
    }
    if (!data || !data.messages) {
      console.log('no messages...', bit)
      return null
    }
    return getMessages(data.messages, { searchTerm, shownLimit }).map((message, index) => {
      for (let person of people || []) {
        message.text = message.text.replace(
          new RegExp(`<@${person.integrationId}>`, 'g'),
          '@' + person.name,
        )
      }
      return (
        <ChatMessage
          key={index}
          {...this.props}
          message={message}
          previousMessage={data.messages[index - 1]}
          hide={hide}
          extraProps={extraProps}
        />
      )
    })
  }
}
