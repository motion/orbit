// @flow
import * as React from 'react'
import { view } from '@mcro/black'

// optimized re-render for sidebar resize
@view
export default class LayoutWrap extends React.PureComponent<> {
  render({ children }) {
    return (
      <wrap>
        {children}
      </wrap>
    )
  }
  static style = {
    wrap: {
      overflow: 'hidden',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 10,
      transform: { z: 0 },
    },
  }
}
