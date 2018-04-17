import * as React from 'react'
import OrbitCardSlackMessage from './slackMessage'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import { RoundButton } from '~/views'
// import pluralize from 'pluralize'

const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)

const exampleTitles = [
  `Context, TSNE, Mobile App`,
  `Superhuman, Funny`,
  `Search, nlp, fluid`,
  `Sketching, creatively`,
]

const uids = {}

export default ({ result, appStore }) => {
  const setting = appStore.settings.slack
  const uid =
    uids[result.id] || Math.floor(Math.random() * exampleTitles.length)
  uids[result.id] = uid
  return {
    title: exampleTitles[uid],
    icon: 'slack',
    subtitle: (
      <row $$row $$flex css={{ opacity: 0.7 }}>
        <RoundButton
          onClick={e => {
            e.stopPropagation()
            const url = `slack://channel?id=${result.data.channel.id}&team=${
              setting.values.oauth.info.team.id
            }`
            App.sendMessage(Desktop, Desktop.messages.OPEN, url)
          }}
        >
          {result.title}
        </RoundButton>
        <div $$flex />
        <row $$row $$centered css={{ opacity: 0.5 }}>
          {result.people.length}
          &nbsp;
          <UI.Icon size={10} opacity={0.35} name="users_single-01" />
          &nbsp;&middot;&nbsp;
          {result.data.messages.length - 1}
          &nbsp;
          <UI.Icon size={10} opacity={0.35} name="reply" />
        </row>
      </row>
    ),
    // via: result.title,
    preview: result.body,
    content: result.data.messages
      .filter(isntAttachment)
      .slice(0, 3)
      .map((message, index) => (
        <OrbitCardSlackMessage
          key={index}
          message={message}
          previousMessage={result.data.messages[index - 1]}
          bit={result}
          appStore={appStore}
        />
      )),
  }
}
