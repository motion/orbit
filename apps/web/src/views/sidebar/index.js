// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import Inbox from '~/views/inbox'

@view.attach('layoutStore')
@view
export default class Sidebar {
  render({ hidden, layoutStore, store, ...props }) {
    const width = Constants.IN_TRAY
      ? Constants.TRAY_WIDTH
      : layoutStore.sidebar.width

    return (
      <UI.Theme name="clear-dark">
        <UI.Drawer
          zIndex={1}
          transition={Constants.SIDEBAR_TRANSITION}
          background="transparent"
          key={2}
          open={!hidden}
          from="right"
          size={width + 20}
        >
          <sidebar>
            <Inbox />
          </sidebar>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    sidebar: {
      userSelect: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    sidebarcontent: {
      marginLeft: 20,
      flex: 1,
    },
  }
}
