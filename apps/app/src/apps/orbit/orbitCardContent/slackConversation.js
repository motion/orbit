import * as React from 'react'
import OrbitCardSlackMessage from './slackMessage'
import * as UI from '@mcro/ui'

const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)

const exampleTitles = [
  `Context, TSNE, Mobile App`,
  `Superhuman, Funny`,
  `Search, nlp, fluid`,
  `Sketching, creatively`,
]

const uids = {}

export default ({ result }) => {
  const uid =
    uids[result.id] || Math.floor(Math.random() * exampleTitles.length)
  uids[result.id] = uid
  return {
    title: exampleTitles[uid],
    icon: 'slack',
    subtitle: (
      <row $$row $$flex>
        <UI.Text ellipse={1}>{result.title}</UI.Text>
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
