import { Popover, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { throttle } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { animated, interpolate, useSpring } from 'react-spring/hooks'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import Searchable from '../../../components/Searchable'
import MainShortcutHandler from '../../../components/shortcutHandlers/MainShortcutHandler'
import { MENU_WIDTH } from '../../../constants'
import { StoreContext } from '../../../contexts'
import { useActiveApps } from '../../../hooks/useActiveApps'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { MergeContext } from '../../../views/MergeContext'
import BrowserDebugTray from './BrowserDebugTray'
import MenuApp from './MenuApp'
import { MenuStore } from './MenuStore'

export type MenuAppProps = Partial<AppProps<any>> & {
  menuStore: MenuStore
  menuId: number
}

function useMenuApps() {
  const apps = useActiveApps()
  return apps.filter(x => x.type === 'search' || x.type === 'lists')
}

export const MenuLayer = observer(function MenuLayer() {
  const stores = useStoresSafe()
  const queryStore = useStore(QueryStore, { sourcesStore: stores.sourcesStore })
  const menuApps = useMenuApps()
  const paneManagerStore = useStore(PaneManagerStore, {
    panes: menuApps,
    onPaneChange: () => {
      AppActions.clearPeek()
    },
  })
  const menuStore = useStore(MenuStore, { paneManagerStore, queryStore })
  const newStores = {
    queryStore,
    menuStore,
    paneManagerStore,
  }

  React.useEffect(() => {
    // watch for mouse enter and leave
    const onMove = throttle(e => {
      const hoverOut = e.target === document.documentElement
      if (hoverOut) {
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

  return (
    <BrowserDebugTray menuStore={menuStore}>
      <MergeContext Context={StoreContext} value={newStores}>
        <MainShortcutHandler>
          <MenuChrome menuStore={menuStore}>
            <MenuLayerContent queryStore={queryStore} menuStore={menuStore} />
          </MenuChrome>
        </MainShortcutHandler>
      </MergeContext>
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

const MenuChrome = observer(({ menuStore, children }: { menuStore: MenuStore; children: any }) => {
  const { menuCenter, menuHeight, openState } = menuStore

  React.useEffect(() => {
    menuStore.onDidRender(open)
  })

  const pad = menuStore.menuPad
  const left = menuCenter - MENU_WIDTH / 2
  const { open, repositioning } = openState
  const config = repositioning ? noAnimationConfig : springyConfig
  const { x, y, opacity } = useSpring({
    x: left,
    y: open ? 0 : -5,
    opacity: open ? 1 : 0,
    config,
  })

  return (
    <>
      <animated.div
        ref={menuStore.menuRef}
        style={{
          height: window.innerHeight,
          position: 'absolute',
          zIndex: 100000,
          pointerEvents: 'none',
          borderRadius: 12,
          top: pad,
          transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          opacity,
          width: MENU_WIDTH,
        }}
      >
        {children}
      </animated.div>
      <animated.div
        style={{
          position: 'absolute',
          transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          opacity,
        }}
      >
        <Popover
          noPortal
          open
          background
          width={MENU_WIDTH + pad * 2}
          height={menuHeight + 11 /* arrow size, for now */}
          towards="bottom"
          delay={0}
          top={0}
          left={0}
          distance={pad}
          forgiveness={pad}
          edgePadding={0}
          elevation={20}
          theme="dark"
        />
      </animated.div>
    </>
  )
})

const itemProps = {
  oneLine: false,
  condensed: true,
  onSelectItem: false,
  // hideSubtitle: true,
}

const MenuLayerContent = React.memo(
  ({ menuStore, queryStore }: { menuStore: MenuStore; queryStore: QueryStore }) => {
    const menuApps = useMenuApps()
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
              id={app.id}
              key={index}
              menuId={index}
              viewType="index"
              title={app.name}
              type={app.type}
              menuStore={menuStore}
              itemProps={itemProps}
            />
          ))}
        </Searchable>
      </View>
    )
  },
)

export default MenuLayer
