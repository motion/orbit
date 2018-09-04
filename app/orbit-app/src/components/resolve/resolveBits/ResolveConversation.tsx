import * as React from 'react'
import { SlackMessage } from './SlackMessage'
import keywordExtract from '@mcro/keyword-extract'
import { SlackBitData, SlackBitDataMessage } from '@mcro/models'
import arrford from 'arrford'
import { BitItemResolverProps } from '../ResolveBit'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const getMessages = (
  messages: SlackBitDataMessage[],
  { shownLimit, searchTerm },
) => {
  let res = messages.slice(0, shownLimit)
  if (searchTerm) {
    const filtered = res.filter(m => m.text.indexOf(searchTerm) >= 0)
    if (filtered.length) {
      res = filtered
    }
  }
  return res
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
    ? (getMessages(data.messages, { searchTerm, shownLimit }).map(
        (message, index) => (
          <SlackMessage
            key={index}
            message={message}
            previousMessage={data.messages[index - 1]}
            bit={bit}
            itemProps={itemProps}
            hide={hide}
          />
        ),
      ) as any) // todo(nate) please fix type error and remove "as any"
    : null
  const title = `${arrford(
    keywordExtract.extract(bit.body, options).slice(0, 3),
  ) || ''}`.replace('```', '')
  return children({
    id: bit.id,
    type: 'bit',
    title,
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
