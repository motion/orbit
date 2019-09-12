import { PaneManagerStore, ProvideStores, QueryStore } from '@o/kit'
import { View } from '@o/ui'
import { useStore } from '@o/use-store'
import { throttle } from 'lodash'
import * as React from 'react'

import { useStores } from '../../hooks/useStores'
import MainShortcutHandler from '../../views/MainShortcutHandler'
import { BrowserDebugTray } from './BrowserDebugTray'
import { MenuApp } from './MenuApp'
import { MenuChrome } from './MenuChrome'
import { ProvideMenuStore, useCreateMenuStore, useMenuApps, useMenuStore } from './MenuStore'
import Searchable from './Searchable'

export const menuApps = ['search', 'topics', 'people']

export function Menu() {
  const queryStore = useStore(QueryStore)
  const menuApps = useMenuApps()

  const paneManagerStore = useStore(PaneManagerStore, {
    panes: menuApps,
    onPaneChange: () => {
      // AppActions.clearPeek()
    },
  })

  const menuStore = useCreateMenuStore({
    paneManagerStore,
    queryStore,
    menuItems: menuApps as any,
    onMenuHover: index => {
      const app = menuApps.find(x => x.index === index)
      if (app) {
        paneManagerStore.setActivePane(`${app.id}`)
      }
    },
  })

  // Handle mouse enter/leave events
  React.useEffect(() => {
    const parentNode = document.querySelector('.app-wrapper')
    const onMove = throttle(e => {
      const isNotHovering = e.target === parentNode
      if (isNotHovering) {
        if (menuStore.isHoveringMenu) {
          menuStore.handleMouseLeave()
        }
      } else {
        if (!menuStore.isHoveringMenu) {
          menuStore.handleMouseEnter()
        }
      }
    }, 32)
    document.addEventListener('mousemove', onMove)
    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  // Handle tray enter/leave/click events
  React.useEffect(() => {
    // return App.onMessage(App.messages.TRAY_EVENT, menuStore.handleTrayEvent)
  }, [])

  return (
    <ProvideMenuStore value={menuStore}>
      <ProvideStores
        stores={{
          queryStore,
          paneManagerStore,
        }}
      >
        <BrowserDebugTray menuStore={menuStore}>
          <MainShortcutHandler>
            <MenuChrome>
              <MenuLayerContent />
            </MenuChrome>
          </MainShortcutHandler>
        </BrowserDebugTray>
      </ProvideStores>
    </ProvideMenuStore>
  )
}

const MenuLayerContent = React.memo(() => {
  const menuStore = useMenuStore()
  const { queryStore } = useStores()
  const menuApps = useMenuApps()
  return (
    <View className="app-parent-bounds">
      <Searchable
        queryStore={queryStore}
        inputProps={{
          ref: menuStore.handleSearchInput,
          onChange: queryStore.onChangeQuery,
        }}
      >
        {menuApps.map(app => (
          <MenuApp
            id={app.id}
            index={app.index}
            key={app.id}
            viewType="index"
            title={app.name}
            type={app.type}
          />
        ))}
      </Searchable>
    </View>
  )
})
