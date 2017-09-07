import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
class Response {
  render({ author, text, active }) {
    return (
      <response $active={active}>
        <bar $$row>
          <name>{author}</name>
          <when>6 days ago</when>
        </bar>
        <content>{text}</content>
      </response>
    )
  }

  static style = {
    response: {
      marginBottom: 10,
      padding: 10,
      border: '1px solid #eee',
      borderRadius: 3,
    },
    bar: {
      justifyContent: 'space-between',
    },
    name: {
      fontWeight: 600,
    },
    content: {
      marginTop: 5,
    },
    active: {
      background: '#444',
    },
  }
}

@view({
  store: class CodeStore {},
})
export default class Issue {
  getLength = () => this.props.store.responses.length

  render({ store, activeIndex }) {
    return (
      <container>
        {store.responses.map((r, index) => (
          <Response {...r} active={index === activeIndex} />
        ))}
        <textarea $reply placeholder="Leave a comment" />
      </container>
    )
  }

  static style = {
    container: {
      color: 'white',
      padding: 10,
      maxWidth: 500,
    },
    reply: {
      width: '100%',
      padding: 5,
      background: '#fafbfc',
      height: 300,
      border: '1px solid none',
      fontSize: 16,
    },
  }
}
