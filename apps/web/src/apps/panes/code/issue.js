import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
class Response {
  render({ author, text, active }) {
    return (
      <response $active={active}>
        <bar $$row>
          <name>
            {author}
          </name>
          <when>6 days ago</when>
        </bar>
        <content>
          {text}
        </content>
      </response>
    )
  }

  static style = {
    response: {
      marginBottom: 10,
      padding: 10,
      border: '1px solid #eee',
      borderRadius: 3,
      background: '#aaa',
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
  store: class CodeStore {
    responses = [
      {
        author: 'nick',
        text: `
      What problem would it solve for you?

In some places (especially tests files) the code is a bit hard to read because of formatting issues like bad indentation. Prettier is an opinionated code formatter, and can help us here.

Also, @mweststrate mentioned in #1035 (comment) the will to implement Prettier in the near future.

Do you think others will benefit from this change as well and it should in core package (see also mobx-utils)?

Yes, but it will not make a difference in the core package.

Are you willing to (attempt) a PR yourself?

Yes, but I'm not sure if I'm the appropriate person.
      `,
      },
      {
        author: 'nate',
        text: `
        Prettier is a welcome addition :). Can you make sure the same settings as in mobx-state-tree are used?
        `,
      },
      {
        author: 'nick',
        text: 'The pull request #1103 was raised to satisfy this issue.',
      },
      {
        author: 'nate',
        text: 'This can be closed now that #1103 has been merged',
      },
    ]
  },
})
export default class Issue {
  getLength = () => this.props.store.responses.length

  render({ store, activeIndex }) {
    return (
      <container>
        {store.responses.map((r, index) =>
          <Response {...r} active={index === activeIndex} />
        )}
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
