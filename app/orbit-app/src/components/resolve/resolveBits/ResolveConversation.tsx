import * as React from 'react'
import { SlackMessage } from './SlackMessage'
import keywordExtract from '@mcro/keyword-extract'
import { SlackBitData } from '@mcro/models'
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
  hide,
}: ItemResolverProps) => {
  const data = bit.data as SlackBitData
  const content = isExpanded
    ? (data.messages
        .slice(0, shownLimit)
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
    title:
      bit.people && bit.people.length
        ? arrford(bit.people.map(p => capitalize((p.name || '').split(' ')[0])))
        : bit.title,
    people: bit.people,
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
