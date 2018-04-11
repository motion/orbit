import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class SlackMessage {
  render({ Text, message }) {
    if (message.text.indexOf('uploaded a file') >= 0) {
      const src = message.text.match(/\<([a-z]+:\/\/[^>]+)\>/g).map(link =>
        link
          .slice(1, link.length)
          .slice(0, link.length - 2)
          .replace(/\|.*$/g, ''),
      )[0]
      console.log('src', src)
      return (
        <div $$flex>
          image
          <img src={src} css={{ maxWidth: '100%' }} />
        </div>
      )
    }
    return (
      <Text ellipse={5}>
        {message.user} {message.text}
      </Text>
    )
  }
}
