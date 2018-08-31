import * as React from 'react'
import { SlackMessage } from './SlackMessage'
import keywordExtract from '@mcro/keyword-extract'
import { SlackBitData } from '@mcro/models'
import arrford from 'arrford'
import { BitItemResolverProps } from '../ResolveBit'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveConversation = ({
  children,
  bit,
  shownLimit = 5,
  itemProps,
  isExpanded,
  searchTerm,
  hide,
}: BitItemResolverProps) => {
  const data = bit.data as SlackBitData
  const content = isExpanded
    ? (data.messages
        .slice(0, shownLimit)
        .filter(m => m.text.indexOf(searchTerm) >= 0)
        .map((message, index) => (
          <SlackMessage
            key={index}
            message={message}
            previousMessage={data.messages[index - 1]}
            bit={bit}
            itemProps={itemProps}
            hide={hide}
          />
        )) as any) // todo(nate) please fix type error and remove "as any"
    : null
  return children({
    id: bit.id,
    type: 'bit',
    title: arrford(
      keywordExtract.extract(bit.body, options).slice(0, 3),
    ).replace('```', ''),
    people: bit.people,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
    icon: 'slack',
    locationLink: bit.location.desktopLink || bit.location.webLink,
    desktopLink: bit.desktopLink,
    webLink: bit.webLink,
    location: bit.title,
    content,
  })
}
