import { view } from '@mcro/black'
import * as React from 'react'
import BitSlackMessage from './slackMessage'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import { RoundButton } from '~/views'
import pluralize from 'pluralize'

// const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)
const exampleTitles = [
  `Context and TSNE`,
  `Superhuman and funny`,
  `Search and nlp`,
  `Sketching and creatively`,
]
const uids = {}

@UI.injectTheme
@view
export default class BitSlackConversation {
  static defaultProps = {
    shownLimit: 5,
  }

  render({ children, bit, appStore, shownLimit, theme, contentStyle }) {
    const uid = uids[bit.id] || Math.floor(Math.random() * exampleTitles.length)
    uids[bit.id] = uid
    return children({
      title: exampleTitles[uid],
      icon: 'slack',
      location: (
        <RoundButton
          onClick={e => {
            e.stopPropagation()
            appStore.open(bit, 'channel')
          }}
        >
          {bit.title.slice(1)}
        </RoundButton>
      ),
      permalink: (
        <UI.Button
          circular
          icon="link69"
          color={theme.active.color}
          size={0.8}
          opacity={0.6}
          onClick={e => {
            e.stopPropagation()
            appStore.open(bit)
          }}
        />
      ),
      bottom: (
        <UI.Text size={0.85} if={bit.data.messages.length > 3}>
          + {bit.data.messages.length - 3}&nbsp;more&nbsp;
          <span if={false}>
            {pluralize('reply', bit.data.messages.length - 3)}
          </span>
        </UI.Text>
      ),
      bottomAfter: (
        <row
          if={bit.people && bit.people.length > 1}
          $meta
          css={{ color: theme.active.color }}
        >
          {bit.people.length}
          &nbsp;
          <UI.Icon
            color="inherit"
            size={10}
            opacity={0.35}
            name="users_single-01"
          />
        </row>
      ),
      // via: bit.title,
      preview: bit.body,
      content: bit.data.messages
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
        )),
    })
  }

  static style = {
    meta: {
      flexFlow: 'row',
      opacity: 0.5,
    },
    space: {
      width: 6,
    },
  }
}
