import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader, PeekContent } from '../index'

@view
export class View extends React.Component {
  render({ bit }) {
    return (
      <>
        <PeekHeader title={bit.title} />
        <PeekContent>{bit.body}</PeekContent>
      </>
    )
  }
}
