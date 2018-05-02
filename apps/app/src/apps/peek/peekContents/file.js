import * as React from 'react'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'

@view
export class File {
  render({ bit }) {
    return (
      <React.Fragment>
        <PeekHeader title={bit.title} />
        <content>{bit.body}</content>
      </React.Fragment>
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
