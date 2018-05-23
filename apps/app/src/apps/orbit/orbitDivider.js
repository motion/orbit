import * as React from 'react'
import { view } from '@mcro/black'

@view
export class OrbitDivider {
  render({ height, ...props }) {
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
      borderRadius: 100,
    },
  }

  static theme = (props, theme) => {
    return {
      bar: {
        height: props.height || 3,
      },
      barOuter: {
        '& .bar': {
          background: theme.active.background,
        },
        '&:hover .bar': {
          background: theme.activeHover.background,
        },
      },
    }
  }
}
