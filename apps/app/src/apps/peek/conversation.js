import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@view
export default class ConversationRenderer {
  render({ thing }) {
    return (
      <conversation>
        {thing.data.messages.map(({ author, message }) => (
          <message>
            <author>{author}</author>
            <text>{message}</text>
          </message>
        ))}
      </conversation>
    )
  }

  static style = {
    author: {
      fontWeight: 700,
    },
    message: {
      marginTop: 10,
    },
  }
}
