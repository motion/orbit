// @flow
import React from 'react'
import { view } from '@mcro/black'
import { SIDEBAR_TRANSITION } from '~/constants'

// optimized re-render for sidebar resize
@view.attach('layoutStore')
@view
export default class LayoutWrap {
  dragger = null

  componentDidMount() {
    this.props.layoutStore.sidebar.attachDragger(this.dragger)
  }

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
        <dragger
          style={{ WebkitAppRegion: 'no-drag' }}
          ref={this.ref('dragger').set}
        />
      </wrap>
    )
  }
  static style = {
    wrap: {
      background: '#fff',
      boxShadow: [
        // 'inset 5px 10px 20px rgba(0,0,0,0.03)',
        '0 0 6px rgba(0,0,0,0.3)',
      ],
      overflow: 'hidden',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 10,
      transform: { z: 0 },
    },
    dragger: {
      width: 8,
      position: 'absolute',
      top: 0,
      right: -4,
      bottom: 0,
      zIndex: 10000,
      cursor: 'ew-resize',
    },
  }
}
