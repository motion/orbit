import * as React from 'react'
import { view } from '@mcro/black'

@view.attach('paneStore')
@view
export default class OrbitDockedPane {
  render({ children, name, paneStore, extraCondition, ...props }) {
    const isActive =
      name === paneStore.activePane &&
      (extraCondition ? extraCondition() : true)
    return (
      <pane $isActive={isActive} {...props}>
        {children}
      </pane>
    )
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
      pointerEvents: 'none',
      opacity: 0,
      transform: {
        x: 10,
      },
    },
    isActive: {
      pointerEvents: 'auto',
      opacity: 1,
      transform: {
        x: 0,
      },
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
