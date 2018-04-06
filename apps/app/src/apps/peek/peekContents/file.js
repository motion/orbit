import * as React from 'react'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import PeekFrame from '../peekFrame'

@view
export class File {
  render({ item }) {
    return (
      <PeekFrame>
        <PeekHeader title={item.title} />
        <content>{item.body}</content>
      </PeekFrame>
    )
  }

  static style = {
    content: {
      padding: 20,
      overflowY: 'scroll',
      flex: 1,
    },
  }
}
