import * as React from 'react'
import { SlackMessage } from './SlackMessage'
import keywordExtract from '@mcro/keyword-extract'
import arrford from 'arrford'
import { capitalize } from 'lodash'
import { ItemResolverProps } from '../../ItemResolver'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveConversation = ({
  children,
  bit,
  appStore,
  shownLimit = 5,
  itemProps,
  isExpanded,
}: ItemResolverProps) => {
  const content = isExpanded
    ? ((bit.data && bit.data.messages) || [])
        .slice(0, shownLimit)
        .map((message, index) => (
          <SlackMessage
            key={index}
            message={message}
            previousMessage={bit.data.messages[index - 1]}
            bit={bit}
            itemProps={itemProps}
          />
        ))
    : null
  return children({
    title:
      bit.people && bit.people.length
        ? arrford(bit.people.map(p => capitalize((p.name || '').split(' ')[0])))
        : bit.title,
    people: bit.people,
    date: new Date(bit.bitUpdatedAt * 1000),
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
    icon: 'slack',
    locationLink: () => appStore.open(bit, 'channel'),
    location: bit.title,
    permalink: () => appStore.open(bit),
    content,
  })
}
