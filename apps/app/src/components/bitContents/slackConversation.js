import { view } from '@mcro/black'
import * as React from 'react'
import BitSlackMessage from './slackMessage'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import { RoundButton } from '~/views'
import pluralize from 'pluralize'

// const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)
const uids = {}

@UI.injectTheme
@view
export default class BitSlackConversation {
  static defaultProps = {
    shownLimit: 3,
  }

  render({ children, result, appStore, shownLimit, theme, contentStyle }) {
    return children({
      title: result.data.summary
        ? result.data.summary.split('::').join(', ')
        : '',
      icon: 'slack',
      location: (
        <RoundButton
          onClick={e => {
            e.stopPropagation()
            appStore.open(result, 'channel')
          }}
        >
          {result.title}
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
            appStore.open(result)
          }}
        />
      ),
      bottom: (
        <UI.Text size={0.85} if={result.data.messages.length > 3}>
          + {result.data.messages.length - 3}&nbsp;more&nbsp;
          <span if={false}>
            {pluralize('reply', result.data.messages.length - 3)}
          </span>
        </UI.Text>
      ),
      bottomAfter: (
        <row
          if={result.people && result.people.length > 1}
          $meta
          css={{ color: theme.active.color }}
        >
          {result.people.length}
          &nbsp;
          <UI.Icon
            color="inherit"
            size={10}
            opacity={0.35}
            name="users_single-01"
          />
        </row>
      ),
      // via: result.title,
      preview: result.body,
      content: result.data.messages
        .slice(0, shownLimit)
        .map((message, index) => (
          <BitSlackMessage
            key={index}
            message={message}
            previousMessage={result.data.messages[index - 1]}
            bit={result}
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
