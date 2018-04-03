import * as React from 'react'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'

@view
export class File {
  render({ item }) {
    return (
      <content>
        <PeekHeader title={item.title} />
        <content>{item.body}</content>
      </content>
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
