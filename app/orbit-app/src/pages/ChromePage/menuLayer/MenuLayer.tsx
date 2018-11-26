import * as React from 'react'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore, useInstantiatedStore } from '@mcro/use-store'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'
import { App } from '@mcro/stores'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import { MenuApp } from './MenuApp'
import { Popover, View } from '@mcro/ui'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { Searchable } from '../../../components/Searchable'
import { BrowserDebugTray } from './BrowserDebugTray'
import { IS_ELECTRON, MENU_WIDTH } from '../../../constants'
import { throttle } from 'lodash'
import { MenuStore, menuApps } from './MenuStore'
import { MainShortcutHandler } from '../../../components/shortcutHandlers/MainShortcutHandler'
import { useSpring, animated, interpolate } from 'react-spring'

export type MenuAppProps = AppProps & { menuStore: MenuStore; menuId: number }
export const maxTransition = 150

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

const springyConfig = {
  mass: 0.8,
  tension: 280,
  friction: 22,
  velocity: 20,
}
const noAnimationConfig = { duration: 1 }

const getContentTransform = (x, y) => `translate3d(${x}px,${y}px,0)`
const getChromeTransform = (x, y) => `translate3d(${x + 5}px,${y}px,0)`

const MenuChrome = React.memo(
  ({ menuStore, children }: { menuStore: MenuStore; children: any }) => {
    const { menuCenter, menuHeight, openState } = useInstantiatedStore(menuStore)

    React.useEffect(() => {
      menuStore.onDidRender()
    })

    const left = menuCenter - MENU_WIDTH / 2
    const { open, repositioning } = openState
    const config = repositioning ? noAnimationConfig : springyConfig
    const [{ x, y, opacity }] = useSpring({
      x: left,
      y: open ? 0 : -5,
      opacity: open ? 1 : 0,
      config,
    })

    return (
      <>
        <animated.div
          style={{
            height: window.innerHeight,
            position: 'absolute',
            zIndex: 100000,
            pointerEvents: 'none',
            borderRadius: 12,
            transform: interpolate([x, y], getContentTransform),
            opacity: opacity,
            width: MENU_WIDTH - menuPad * 2,
            margin: menuPad,
          }}
        >
          {children}
        </animated.div>
        <animated.div
          style={{
            position: 'absolute',
            transform: interpolate([x, y], getChromeTransform),
            opacity: opacity,
          }}
        >
          <Popover
            noPortal
            open
            background
            width={MENU_WIDTH}
            height={menuHeight + 11 /* arrow size, for now */}
            towards="bottom"
            delay={0}
            top={IS_ELECTRON ? 0 : 28}
            left={0}
            distance={6}
            forgiveness={10}
            edgePadding={0}
            elevation={20}
            theme="dark"
          />
        </animated.div>
      </>
    )
  },
)

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
