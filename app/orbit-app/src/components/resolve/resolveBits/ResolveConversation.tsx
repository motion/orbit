import * as React from 'react'
import { SlackMessage } from '../../bitViews/chat/ChatMessage'
import { SlackBitData, SlackBitDataMessage } from '@mcro/models'
import { BitItemResolverProps } from '../ResolveBit'

export const ResolveConversation = (props: BitItemResolverProps) => {
  const { children, bit, shownLimit = Infinity, isExpanded, searchTerm, hide, extraProps } = props
  const data = bit.data as SlackBitData
  const people = bit.people || []
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
