import * as React from 'react'
import { view } from '@mcro/black'

@view.ui
export class PeekContent extends React.Component {
  render({ children }) {
    return (
      <peekContent>
        <fadeTop />
        <contentInner>{children}</contentInner>
      </peekContent>
    )
  }

  static style = {
    peekContent: {
      flex: 1,
      position: 'relative',
      marginTop: -10,
      zIndex: 0,
      // padding: [0, 10],
    },
    fadeTop: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 30,
      background: 'linear-gradient(#f9f9f9, transparent)',
      zIndex: 1000,
    },
    contentInner: {
      overflowY: 'scroll',
      padding: [10 + 15, 0, 15],
      flex: 1,
      fontSize: 16,
      lineHeight: '1.6rem',
      wordBreak: 'break-word',
    },
  }
}
