// @flow
import React from 'react'
import { view } from '@jot/black'
import { SIDEBAR_TRANSITION } from '~/constants'

// optimized re-render for sidebar resize
@view
export default class LayoutWrap {
  render({ layoutStore, children }) {
    return (
      <wrap
        $$transition={
          layoutStore.sidebar.changing ? `right ${SIDEBAR_TRANSITION}` : 'none'
        }
        $$right={layoutStore.sidebar.trueWidth}
      >
        {children}
      </wrap>
    )
  }
  static style = {
    wrap: {
      background: '#fff',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 10,
    },
  }
}
