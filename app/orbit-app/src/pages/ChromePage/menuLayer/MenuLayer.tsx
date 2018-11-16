import * as React from 'react'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore, useInstantiatedStore } from '@mcro/use-store'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'
import { App } from '@mcro/stores'
import { view } from '@mcro/black'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import { MenuApp } from './MenuApp'
import { Popover, View } from '@mcro/ui'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { Searchable } from '../../../components/Searchable'
import { BrowserDebugTray } from './BrowserDebugTray'
import { IS_ELECTRON } from '../../../constants'
import { throttle } from 'lodash'
import { MenuStore, menuApps } from './MenuStore'
import { MainShortcutHandler } from '../../../components/shortcutHandlers/MainShortcutHandler'

export type MenuAppProps = AppProps & { menuStore: MenuStore; menuId: number }
export const maxTransition = 150

const transition = `opacity ease 100ms, transform ease ${180}ms`
export const menuPad = 6

export const MenuLayer = React.memo(() => {
  const stores = React.useContext(StoreContext)
  const queryStore = useStore(QueryStore, { sourcesStore: stores.sourcesStore })
  const selectionStore = useStore(SelectionStore, {
    queryStore,
    onClearSelection: () => {
      AppActions.clearPeek()
    },
  })
  const paneManagerStore = useStore(PaneManagerStore, {
    panes: menuApps,
    selectionStore,
  })
  const menuStore = useStore(MenuStore, { paneManagerStore, queryStore })
  const allStores = {
    ...stores,
    queryStore,
    selectionStore,
    menuStore,
    paneManagerStore,
  }

  React.useEffect(() => {
    // watch for mouse enter and leave
    const onMove = throttle(e => {
      const hoverOut = e.target === document.documentElement
      if (hoverOut) {
        if (menuStore.isHoveringDropdown) {
          menuStore.handleMouseLeave()
        }
      } else {
        if (!menuStore.isHoveringDropdown) {
          menuStore.handleMouseEnter()
        }
      }
    }, 32)
    document.addEventListener('mousemove', onMove)
    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  React.useEffect(() => {
    return App.onMessage(App.messages.TRAY_EVENT, menuStore.handleTrayEvent)
  }, [])

  return (
    <BrowserDebugTray>
      <StoreContext.Provider value={allStores}>
        <MainShortcutHandler>
          <MenuChrome menuStore={menuStore}>
            <MenuLayerContent queryStore={queryStore} menuStore={menuStore} />
          </MenuChrome>
        </MainShortcutHandler>
      </StoreContext.Provider>
    </BrowserDebugTray>
  )
})

const MenuChrome = React.memo(
  ({ menuStore, children }: { menuStore: MenuStore; children: any }) => {
    const { menuCenter, menuWidth, menuHeight, isOpenFast } = useInstantiatedStore(menuStore)
    const left = menuCenter - menuWidth / 2
    return (
      <>
        <MenuChromeFrame
          width={menuWidth - menuPad * 2}
          margin={menuPad}
          transform={{ x: left - 1, y: isOpenFast ? 0 : -5 }}
          transition={transition}
          opacity={isOpenFast ? 1 : 0}
        >
          {children}
        </MenuChromeFrame>
        <Popover
          open={isOpenFast}
          transition={transition}
          background
          width={menuWidth}
          height={menuHeight + 11 /* arrow size, for now */}
          towards="bottom"
          delay={0}
          top={IS_ELECTRON ? 0 : 28}
          left={left + 5}
          distance={6}
          forgiveness={10}
          edgePadding={0}
          elevation={20}
          theme="dark"
        />
      </>
    )
  },
)

const MenuChromeFrame = view(View, {
  height: window.innerHeight,
  position: 'absolute',
  zIndex: 100000,
  pointerEvents: 'none',
  borderRadius: 12,
})

const itemProps = {
  extraProps: {
    oneLine: false,
    condensed: true,
    preventSelect: true,
  },
  hide: {
    subtitle: true,
  },
}

const MenuLayerContent = React.memo(
  ({ menuStore, queryStore }: { menuStore: MenuStore; queryStore: QueryStore }) => {
    return (
      <View className="app-parent-bounds" pointerEvents="auto">
        <Searchable
          queryStore={queryStore}
          inputProps={{
            forwardRef: menuStore.handleSearchInput,
            onChange: queryStore.onChangeQuery,
          }}
        >
          {menuApps.map((app, index) => (
            <MenuApp
              id={app}
              key={index}
              menuId={index}
              viewType="index"
              title={app}
              type={app}
              menuStore={menuStore}
              itemProps={itemProps}
            />
          ))}
        </Searchable>
      </View>
    )
  },
)
