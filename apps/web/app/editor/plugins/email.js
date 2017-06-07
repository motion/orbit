import { replacer } from '~/editor/helpers'
import React from 'react'
import { view } from '@jot/helpers'
import node from '~/editor/node'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'

class EmailStore {
  address = 'forward@jot.dev'

  onFill = () => {
    const { node: { data }, setData } = this.props
    const nick = {
      from: { email: 'cammarata.nick@gmail.com', name: 'Nick Cammarata' },
    }

    const nate = {
      from: { email: 'nate.wienert@gmail.com', name: 'Nate Wienert' },
    }

    const contents = [
      {
        ...nick,
        content: 'Nate, what do you think about Jot so far?',
      },
      {
        ...nate,
        content: 'Wow, those strike through animations really are something',
      },
      {
        ...nick,
        content: 'Would you call that our breakthrough?',
      },
      {
        ...nate,
        content:
          "I don't know, there's really too much blur for me to see anything",
      },
    ]

    setData(data.set('contents', contents))
  }

  onReset = () => {
    const { node: { data }, setData } = this.props
    setData(data.set('contents', null))
  }
}

@node
@view({
  store: EmailStore,
})
class EmailNode {
  render({ store, node: { data } }) {
    const contents = data.get('contents') || null

    console.log('contents are', contents)

    return (
      <emailNode contentEditable="false">
        <none if={contents === null}>
          <noneText>Forward to {store.address}</noneText>
          <Button $button onClick={store.onFill}>
            Fake it till you make it
          </Button>
        </none>
        <emails if={contents !== null}>
          <inner>
            {contents.map(email =>
              <email>
                <from $$row>
                  <name>{email.from.name}</name>
                  <address>{email.from.email}</address>
                </from>
                <content>{email.content}</content>
              </email>
            )}
          </inner>
          <Button $button onClick={store.onReset}>reset</Button>
        </emails>
      </emailNode>
    )
  }

  static style = {
    emailNode: {
      background: '#efefef',
      border: '1px solid #ccc',
      flex: 1,
      padding: 30,
    },
    noneText: {
      fontSize: 24,
      opacity: 0.8,
    },
    button: {
      marginTop: 15,
    },
    none: {
      alignSelf: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    emails: {},
    from: {
      justifyContent: 'space-between',
      flex: 1,
      opacity: 0.8,
    },
    email: {
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
    },
    content: {
      padding: 5,
    },
  }
}

export default class Email {
  name = 'email'
  nodes = {
    [BLOCKS.EMAIL]: EmailNode,
  }
  plugins = [replacer(/^(\-email)$/, 'email', { contents: null })]
}
