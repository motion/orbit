import * as React from 'react'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'
import { setTrayFocused } from './helpers'
import { App, Desktop, Electron } from '@mcro/stores'
import { react, ensure, always, view } from '@mcro/black'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import { MenuApp } from './MenuApp'
import { AppType } from '@mcro/models'
import { Popover, View, Col } from '@mcro/ui'
import { TrayActions } from '../../../actions/Actions'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'

export type MenuAppProps = AppProps & { menuStore: MenuStore; menuId: number }

const panes = ['people', 'topics', 'lists']

const sendTrayEvent = (key, value) => {
  App.setState({
    trayState: {
      trayEvent: key,
      trayEventAt: value,
    },
  })
}

export class MenuStore {
  props: {
    paneManagerStore: PaneManagerStore
  }

  height = 300
  isHoveringDropdown = false

  get menuOpenID() {
    if (!App.openMenu) {
      return false
    }
    return App.openMenu.id
  }

  setActivePane = react(
    () => {
      if (typeof this.hoverID === 'number') {
        return this.hoverID
      }
      return this.lastOpenMenuID
    },
    id => {
      if (typeof id === 'number') {
        const pane = panes[id]
        this.props.paneManagerStore.setActivePane(pane)
      }
    },
  )

  lastOpenMenuID = react(
    () => this.menuOpenID,
    (val, { state }) => {
      if (!state.hasResolvedOnce) {
        // for now just hardcoding to start at #2 app
        return 2
      }
      ensure('is number', typeof val === 'number')
      return val
    },
  )

  closePeekOnChangeMenu = react(
    () => typeof this.menuOpenID === 'number',
    isChanging => {
      ensure('isChanging', isChanging)
      AppActions.clearPeek()
    },
  )

  showMenusBeforeOpen = react(
    () => this.openQuick,
    open => {
      ensure('open', open)
      window['electronRequire']('electron').remote.app.show()
    },
  )

  // handleAppViewFocus = react(
  //   () => App.showingPeek,
  //   showingPeek => {
  //     ensure('showingPeek', showingPeek)
  //     setTrayFocused(true)
  //   },
  // )

  get hoverID() {
    const { trayState } = App.state
    always(trayState.trayEventAt)
    const id = trayState.trayEvent.replace('TrayHover', '')
    if (id === 'Out') {
      return false
    }
    return +id
  }

  get isHoveringIcon() {
    return typeof this.hoverID === 'number'
  }

  get holdingOption() {
    return Desktop.keyboardState.isHoldingOption
  }

  openQuick = react(
    () => [this.holdingOption, this.isHoveringIcon || this.isHoveringDropdown],
    async ([holdingOption, hoveringMenu], { sleep, when }) => {
      if (holdingOption) {
        return true
      }
      // if hovering the app window keep it open until not
      if (Desktop.hoverState.appHovered[0]) {
        await when(() => !Desktop.hoverState.appHovered[0])
        await sleep(60)
      }
      return hoveringMenu
    },
  )

  // this is to allow electon to "show" app before animations occur
  // and likewise to allow popover to animate hidden before hiding again
  openVisually = react(
    () => this.openQuick,
    async (open, { sleep }) => {
      if (open) {
        // sleep before closing
        await sleep(50)
      } else {
        // sleep before opening
        await sleep(100)
      }
      return open
    },
  )

  get menuCenter() {
    const id = typeof this.hoverID === 'number' ? this.hoverID : this.lastOpenMenuID
    const trayBounds = Desktop.state.operatingSystem.trayBounds
    const baseOffset = 25
    const offset = +id == id ? (+id + 1) * 25 + baseOffset : 120
    return trayBounds[0] + offset
  }

  // uses faster open so we can react to things quickly
  setMenuBounds = react(
    () => [this.hoverID, this.openQuick, this.menuCenter],
    ([menuID, open, menuCenter]) => {
      ensure('valid id', typeof this.hoverID === 'number')
      const id = +menuID
      const width = 300
      App.setState({
        trayState: {
          menuState: {
            [id]: {
              open,
              position: [menuCenter - width / 2, 0],
              // TODO: determine this dynamically
              size: [300, 300],
            },
            [+this.lastOpenMenuID]: {
              open: false,
            },
          },
        },
      })
    },
  )

  focusedMenu = react(
    () => this.openVisually,
    async (open, { sleep, whenChanged }) => {
      if (!open) {
        await sleep(150)
        setTrayFocused(false)
        return false
      }
      if (Desktop.keyboardState.isHoldingOption) {
        // wait for pin to focus the menu
        await whenChanged(() => Electron.state.pinKey.at)
        console.log('GOT A PIN KEY', Electron.state.pinKey.name)
      }
      setTrayFocused(true)
      await sleep()
      return this.menuOpenID
    },
    {
      deferFirstRun: true,
    },
  )

  setHeight = (height: number) => {
    this.height = height

    if (this.lastOpenMenuID === false) {
      return
    }
    App.setState({
      trayState: {
        menuState: {
          [this.lastOpenMenuID]: {
            size: [300, height],
          },
        },
      },
    })
  }

  handleMouseEnter = () => {
    this.isHoveringDropdown = true
  }

  handleMouseLeave = () => {
    console.log('MOUSE LEAVE')
    this.isHoveringDropdown = false
  }
}

export const MenuLayer = React.memo(() => {
  const { sourcesStore, settingStore } = React.useContext(StoreContext)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const selectionStore = useStore(SelectionStore, { queryStore })
  const paneManagerStore = useStore(PaneManagerStore, { panes, selectionStore })
  const menuStore = useStore(MenuStore, { paneManagerStore })
  const storeProps = {
    settingStore,
    sourcesStore,
    queryStore,
    selectionStore,
    menuStore,
    paneManagerStore,
  }
  const width = 300
  React.useEffect(() => {
    return App.onMessage(App.messages.TRAY_EVENT, async (key: keyof TrayActions) => {
      switch (key) {
        case 'TrayToggleOrbit':
          App.setOrbitState({ docked: !App.state.orbitState.docked })
          break
        case 'TrayHover0':
        case 'TrayHover1':
        case 'TrayHover2':
        case 'TrayHoverOrbit':
        case 'TrayHoverOut':
          sendTrayEvent(key, Date.now())
          break
      }
    })
  }, [])
  log('!!! render MenuLayer')
  const transition = 'opacity ease-in 60ms, transform ease 200ms'
  const pad = 6
  return (
    <StoreContext.Provider value={storeProps}>
      <MenuChrome
        width={width - pad * 2}
        margin={pad}
        transform={{ x: menuStore.menuCenter - width / 2 }}
        transition={transition}
        opacity={menuStore.openQuick ? 1 : 0}
      >
        <View
          padding={10}
          margin={-10}
          onMouseEnter={menuStore.handleMouseEnter}
          onMouseLeave={menuStore.handleMouseLeave}
          flex={1}
        >
          <Col overflowX="hidden" overflowY="auto" flex={1} className="app-parent-bounds">
            {(['people', 'topics', 'lists'] as AppType[]).map((app, index) => (
              <MenuApp
                id={app}
                key={app}
                menuId={index}
                view="index"
                title={app}
                type={app}
                menuStore={menuStore}
              />
            ))}
          </Col>
        </View>
      </MenuChrome>
      <Popover
        open={menuStore.openQuick}
        transition={transition}
        background
        width={width}
        towards="bottom"
        delay={0}
        top={0}
        distance={6}
        forgiveness={10}
        edgePadding={0}
        left={menuStore.menuCenter}
        maxHeight={window.innerHeight}
        elevation={6}
        theme="dark"
      >
        <div style={{ height: menuStore.height }} />
      </Popover>
    </StoreContext.Provider>
  )
})

const MenuChrome = view(View, {
  height: window.innerHeight,
  position: 'absolute',
  zIndex: 100000,
  pointerEvents: 'auto',
  overflow: 'hidden',
  borderRadius: 6,
})
