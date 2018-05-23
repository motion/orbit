import { view } from '@mcro/black'

@view
export class Conversation {
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
