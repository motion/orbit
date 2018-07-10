import * as React from 'react'
import { view } from '@mcro/black'

@view.ui
export class PeekContent extends React.Component {
  render({ children }) {
    return (
      <peekContent>
        <contentInner>{children}</contentInner>
      </peekContent>
    )
  }

  static style = {
    peekContent: {
      flex: 1,
      position: 'relative',
      zIndex: 0,
    },
    contentInner: {
      overflowY: 'scroll',
      flex: 1,
      fontSize: 16,
      lineHeight: '1.6rem',
      wordBreak: 'break-word',
    },
  }
}
