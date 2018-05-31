import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader } from '../peekHeader'

@view
export class File extends React.Component {
  render({ bit }) {
    return (
      <>
        <PeekHeader title={bit.title} />
        <content>{bit.body}</content>
      </>
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
