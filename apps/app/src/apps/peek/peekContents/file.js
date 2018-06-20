import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader, PeekContent } from '../index'

@view
export class File extends React.Component {
  render({ bit }) {
    return (
      <>
        <PeekHeader title={bit.title} />
        <PeekContent>{bit.body}</PeekContent>
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
