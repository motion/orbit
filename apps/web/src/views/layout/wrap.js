// @flow
import React from 'react'
import { view } from '@mcro/black'
import { SIDEBAR_TRANSITION } from '~/constants'

// optimized re-render for sidebar resize
@view.attach('layoutStore')
@view
export default class LayoutWrap {
  render({ layoutStore, children }) {
    return (
      <wrap
        style={{
          transition: layoutStore.sidebar.changing
            ? `right ${SIDEBAR_TRANSITION}`
            : 'none',
          right: layoutStore.sidebar.trueWidth,
        }}
      >
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
      zIndex: 10,
      transform: { z: 0 },
    },
  }
}
