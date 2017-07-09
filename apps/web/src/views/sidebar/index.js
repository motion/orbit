// @flow
import React from 'react'
import { view, Shortcuts } from '@mcro/black'
import * as UI from '@mcro/ui'
import Login from './login'
import SidebarStore from './store'
import Projects from './projects'
import Menu from './menu'
import UserBar from './userBar'
import type LayoutStore from '~/stores/layoutStore'
import * as Constants from '~/constants'

type Props = {
  layoutStore: LayoutStore,
  store: SidebarStore,
}

@view
class SidebarContent {
  render() {
    return (
      <inner $$flex>
        <UserBar />
        <Login />
        <Menu />
        <Projects />
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
    const active = Constants.IN_TRAY ? true : layoutStore.sidebar.active
    const width = Constants.IN_TRAY
      ? Constants.TRAY_WIDTH
      : layoutStore.sidebar.width

    return (
      <UI.Theme key={0} name="clear-dark">
        <Shortcuts key={1} name="all" handler={store.handleShortcut}>
          <UI.Drawer
            zIndex={1}
            transition={Constants.SIDEBAR_TRANSITION}
            background={[40, 40, 40, 0.5]}
            key={2}
            open={active}
            from="right"
            size={width}
          >
            <sidebar>
              <SidebarContent key={2} />
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
