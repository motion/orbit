// @flow
import React from 'react'
import { view, Shortcuts } from '@mcro/black'
import * as UI from '@mcro/ui'
import Login from './login'
import Signup from './signup'
import SidebarStore from './store'
import Projects from './projects'
import type LayoutStore from '~/stores/layoutStore'
import { IN_TRAY, TRAY_WIDTH, SIDEBAR_TRANSITION } from '~/constants'

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
}

@view({
  store: class {
    team = 'Motion'
  },
})
class SidebarInner {
  render({ store }) {
    const color = '#fff'
    const borderColor = [255, 255, 255, 0.3]
    return (
      <inner $$flex>
        <Login />
        <Signup />
        <Projects />
        <UI.SlotFill.Slot name="sidebar">
          {items =>
            <activeSidebar>
              {items}
            </activeSidebar>}
        </UI.SlotFill.Slot>
      </inner>
    )
  }
}

@view.attach('layoutStore')
@view({
  store: SidebarStore,
})
export default class Sidebar {
  render({ layoutStore, store }: Props) {
    const active = IN_TRAY ? true : layoutStore.sidebar.active
    const width = IN_TRAY ? TRAY_WIDTH : layoutStore.sidebar.width

    return (
      <UI.Theme name="clear-dark">
        <Shortcuts key={1} name="all" handler={store.handleShortcut}>
          <UI.Drawer
            transition={SIDEBAR_TRANSITION}
            key={2}
            background="transparent"
            open={active}
            from="right"
            size={width}
            zIndex={9}
          >
            <sidebar>
              <SidebarInner key={0} />
            </sidebar>
          </UI.Drawer>
        </Shortcuts>
      </UI.Theme>
    )
  }

  static style = {
    sidebar: {
      width: '100%',
      overflow: 'hidden',
      userSelect: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
    },
  }
}
