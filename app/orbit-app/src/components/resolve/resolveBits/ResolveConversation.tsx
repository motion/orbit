import * as React from 'react'
import { SlackMessage } from './SlackMessage'
import { SlackBitData, SlackBitDataMessage } from '@mcro/models'
import { BitItemResolverProps } from '../ResolveBit'

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

export const ResolveConversation = (props: BitItemResolverProps) => {
  const { children, bit, shownLimit = Infinity, isExpanded, searchTerm, hide } = props
  const data = bit.data as SlackBitData
  const people = bit.people || []
  const content = isExpanded
    ? (getMessages(data.messages, { searchTerm, shownLimit }).map((message, index) => {
        for (let person of people) {
          message.text = message.text.replace(
            new RegExp(`<@${person.integrationId}>`, 'g'),
            '@' + person.name,
          )
        }
        return (
          <SlackMessage
            key={index}
            {...props}
            message={message}
            previousMessage={data.messages[index - 1]}
            hide={hide}
          />
        )
      }) as any) // todo(nate) please fix type error and remove "as any"
    : null
  return children({
    id: `${bit.id}`,
    type: 'bit',
    title: bit.title,
    people,
    preview: bit.title,
    icon: 'slack',
    locationLink: bit.location.desktopLink || bit.location.webLink,
    desktopLink: bit.desktopLink,
    webLink: bit.webLink,
    location: bit.location.name,
    content,
  })
}
