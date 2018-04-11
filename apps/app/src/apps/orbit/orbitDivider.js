import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@UI.injectTheme
@view
export default class OrbitDivider {
  render({ ...props }) {
    return (
      <barOuter {...props}>
        <bar />
      </barOuter>
    )
  }
  static style = {
    barOuter: {
      pointerEvents: 'all',
      margin: [0, 6],
      padding: 10,
      cursor: 'ns-resize',
      zIndex: 10,
    },
    bar: {
      flex: 1,
      height: 3,
      borderRadius: 100,
    },
  }
  static theme = (props, theme) => {
    return {
      barOuter: {
        '& .bar': {
          background: theme.hover.background,
        },
        '&:hover .bar': {
          background: theme.active.background,
        },
      },
    }
  }
}
