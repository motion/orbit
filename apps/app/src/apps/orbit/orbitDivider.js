import * as React from 'react'
import { view, attachTheme } from '@mcro/black'

@attachTheme
@view
export class OrbitDivider extends React.Component {
  render({ height, theme, ...props }) {
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
        height: props.height || 1,
      },
      barOuter: {
        '& .bar': {
          background: theme.hover.background,
        },
        // '&:hover .bar': {
        //   background: theme.activeHover.background,
        // },
      },
    }
  }
}
