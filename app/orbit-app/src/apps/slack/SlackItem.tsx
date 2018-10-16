import * as React from 'react'
import { SlackBitDataMessage } from '@mcro/models'
import { SlackMessage } from './views/SlackMessage'
import { SlackAppProps } from './slack'

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

export class SlackItem extends React.Component<SlackAppProps> {
  render() {
    const { bit, searchTerm, shownLimit, extraProps } = this.props
    const { data, people } = bit
    return getMessages(data.messages, { searchTerm, shownLimit }).map((message, index) => {
      for (let person of people) {
        message.text = message.text.replace(
          new RegExp(`<@${person.integrationId}>`, 'g'),
          '@' + person.name,
        )
      }
      return (
        <SlackMessage
          key={index}
          extraProps={extraProps}
          message={message}
          previousMessage={data.messages[index - 1]}
          hide={hide}
        />
      )
    })
  }
}
