// @flow
import React from 'react'
import { view, Shortcuts } from '@mcro/black'
import * as UI from '@mcro/ui'
import Login from '../login'
import SidebarStore from './store'
import Projects from './projects'
import Menu from './menu'
import UserBar from './userBar'
import type LayoutStore from '~/stores/layoutStore'
import * as Constants from '~/constants'
import Inbox from '~/views/inbox'

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

@view.attach('layoutStore', 'explorerStore')
@view({
  store: SidebarStore,
})
export default class Sidebar {
  render({ explorerStore, layoutStore, store }: Props) {
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
            background="transparent"
            key={2}
            open={active}
            from="right"
            size={width + 20}
          >
            <sidebar>
              <sidebarcontent>
                <SidebarContent key={2} />
              </sidebarcontent>

              <UI.Theme name="light">
                <UI.Drawer
                  open={explorerStore.showDiscussions}
                  from="right"
                  size={width + 20}
                  background="#fefefe"
                  css={{
                    paddingLeft: 20,
                  }}
                  zIndex={100}
                  transition
                  scrollable
                >
                  <docdrawer>
                    <Inbox document={explorerStore.document} />
                  </docdrawer>
                </UI.Drawer>
              </UI.Theme>
            </sidebar>
          </UI.Drawer>
        </Shortcuts>
      </UI.Theme>
    )
  }

  static style = {
    sidebar: {
      overflow: 'hidden',
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
