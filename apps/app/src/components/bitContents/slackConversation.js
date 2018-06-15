import { view } from '@mcro/black'
import * as React from 'react'
import { BitSlackMessage } from './slackMessage'
import * as UI from '@mcro/ui'
import { RoundButton } from '~/views/roundButton'
import keywordExtract from 'keyword-extractor'
import arrford from 'arrford'
import { getSlackDate } from '~/helpers'
import { capitalize } from 'lodash'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

@view
export class BitSlackConversation extends React.Component {
  static defaultProps = {
    shownLimit: 5,
  }

  render({ children, bit, appStore, shownLimit, contentStyle, isExpanded }) {
    const content = isExpanded
      ? (bit.data.messages || [])
          .slice(0, shownLimit)
          .map((message, index) => (
            <BitSlackMessage
              key={index}
              message={message}
              previousMessage={bit.data.messages[index - 1]}
              bit={bit}
              appStore={appStore}
              contentStyle={contentStyle}
            />
          ))
      : null
    return children({
      title: arrford((bit.people || []).map(p => capitalize(p.name)), false),
      people: bit.people,
      date: getSlackDate(bit.bitUpdatedAt),
      preview: keywordExtract
        .extract(bit.body, options)
        .slice(0, 4)
        .join(' '),
      icon: 'slack',
      location: (
        <RoundButton
          style={{ marginLeft: -4 }}
          onClick={e => {
            e.stopPropagation()
            appStore.open(bit, 'channel')
          }}
        >
          {bit.title.slice(1)}
        </RoundButton>
      ),
      permalink: () => appStore.open(bit),
      content,
    })
  }

  static style = {
    meta: {
      flexFlow: 'row',
      alignItems: 'center',
      opacity: 0.5,
    },
    space: {
      width: 6,
    },
  }
}
