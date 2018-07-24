import { view } from '@mcro/black'
import * as React from 'react'
import { SlackMessage } from './SlackMessage'
import { RoundButton } from '../../views/RoundButton'
import keywordExtract from 'keyword-extractor'
import arrford from 'arrford'
import { getSlackDate } from '../../helpers'
import { capitalize } from 'lodash'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveConversation = ({
  children,
  bit,
  searchStore,
  shownLimit = 5,
  itemProps,
  isExpanded,
}) => {
  if (!bit) {
    console.log('no bit :/')
    return null
  }
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
    title: arrford(
      (bit.people || []).map(p => capitalize((p.name || '').split(' ')[0])),
      false,
    ),
    people: bit.people,
    date: getSlackDate(bit.bitUpdatedAt),
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
    icon: 'slack',
    location: (
      <RoundButton
        onClick={e => {
          e.stopPropagation()
          searchStore.open(bit, 'channel')
        }}
      >
        {bit.title.slice(1)}
      </RoundButton>
    ),
    permalink: () => searchStore.open(bit),
    content,
  })
}
