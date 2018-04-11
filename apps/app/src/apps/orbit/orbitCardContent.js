import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCardSlackMessage from './orbitCard/slackMessage'

const isntAttachment = x => !x.text.match(/\<([a-z]+:\/\/[^>]+)\>/g)

@view
export default class OrbitCardContent {
  render({ result, Text }) {
    return (
      <React.Fragment>
        <React.Fragment if={result.integration === 'slack'}>
          {result.data.messages
            .reverse()
            .filter(isntAttachment)
            .slice(0, 3)
            .map((message, index) => (
              <OrbitCardSlackMessage
                key={index}
                message={message}
                Text={Text}
              />
            ))}
        </React.Fragment>
      </React.Fragment>
    )
  }

  static style = {}
}
