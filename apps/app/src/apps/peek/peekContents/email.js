import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
// import { Bit } from '@mcro/models'

@view
export class Email {
  render({ bit }) {
    return (
      <content>
        <PeekHeader title={bit.title} date={bit.createdAt} />
        <body>
          <UI.Text size={1.2}>{bit.body}</UI.Text>
        </body>
      </content>
    )
  }

  static style = {
    content: {
      overflowY: 'scroll',
      flex: 1,
    },
    body: {
      padding: 20,
      flex: 1,
      overflowY: 'scroll',
    },
  }
}
