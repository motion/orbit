import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class OrbitDockedPane {
  render({ children, ...props }) {
    return <pane {...props}>{children}</pane>
  }

  static style = {
    pane: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
      padding: [0, 8],
    },
  }

  static theme = (props, theme) => {
    return {
      pane: {
        background: theme.base.background,
      },
    }
  }
}
