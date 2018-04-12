import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCardSlackMessage from './slackMessage'

const isntAttachment = x => !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)

@view
export default class SlackConversation {
  render({ bit }) {
    return (
      <React.Fragment>
        {bit.data.messages
          .reverse()
          .filter(isntAttachment)
          .slice(0, 3)
          .map((message, index) => (
            <OrbitCardSlackMessage
              key={index}
              message={message}
              bit={bit}
              Text={Text}
            />
          ))}
      </React.Fragment>
    )
  }

  static style = {}
}
