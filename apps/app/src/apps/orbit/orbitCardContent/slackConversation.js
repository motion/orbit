import * as React from 'react'
import OrbitCardSlackMessage from './slackMessage'

const isntAttachment = x => !x.text || !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)

export default ({ result }) => ({
  title: result.title,
  icon: 'slack',
  subtitle: `Context, TSNE, Mobile App -- ${
    result.data.messages.length
  } messages`,
  content: result.data.messages
    .reverse()
    .filter(isntAttachment)
    .slice(0, 3)
    .map((message, index) => (
      <OrbitCardSlackMessage
        key={index}
        message={message}
        bit={result}
        Text={Text}
      />
    )),
})
