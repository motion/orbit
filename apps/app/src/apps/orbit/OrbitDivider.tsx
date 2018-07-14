import * as React from 'react'
import { view, attachTheme } from '@mcro/black'

@attachTheme
@view
export class OrbitDivider extends React.Component<any> {
  render() {
    const { height, theme, ...props } = this.props
    return (
      <div $barOuter {...props}>
        <div $bar />
      </div>
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

  static theme = ({ theme, height }) => {
    return {
      bar: {
        height: height || 1,
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
