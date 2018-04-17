import * as React from 'react'
import OrbitCardSlackMessage from './slackMessage'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'

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
      <row $$row $$flex>
        <UI.Button
          ellipse={1}
          sizeRadius={2}
          sizeHeight={0.8}
          sizePadding={1.1}
          borderWidth={0}
          inline
          margin={[-2, -5]}
          onClick={e => {
            e.stopPropagation()
            const url = `slack://channel?id=${result.data.channel.id}&team=${
              setting.values.oauth.info.team.id
            }`
            console.log('opening', url)
            App.sendMessage(Desktop, Desktop.messages.OPEN, url)
          }}
        >
          {result.title}
        </UI.Button>
        <div $$flex />
        <UI.Text opacity={0.5}>
          {result.data.messages.length - 1} replies
        </UI.Text>
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
          Text={Text}
        />
      )),
  }
}
