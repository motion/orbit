import * as React from 'react'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { useStore } from '@mcro/use-store'
import { SelectionStore } from '../../../stores/SelectionStore'
import { StoreContext } from '../../../contexts'
import { setTrayFocused } from './helpers'
import { App, Desktop, Electron } from '@mcro/stores'
import { react, ensure, always } from '@mcro/black'
import { AppActions } from '../../../actions/AppActions'
import { AppProps } from '../../../apps/AppProps'
import { MenuApp } from './MenuApp'
import { AppType } from '@mcro/models'
import { Popover, View, Col } from '@mcro/ui'
import { TrayActions } from '../../../actions/Actions'

export type MenuAppProps = AppProps & { menuStore: MenuStore; menuId: number }

const sendTrayEvent = (key, value) => {
  App.setState({
    trayState: {
      trayEvent: key,
      trayEventAt: value,
    },
  })
}

export class MenuStore {
  isHoveringDropdown = false

  get menuOpenID() {
    if (!App.openMenu) {
      return false
    }
    return App.openMenu.id
  }

  lastOpenMenu = react(
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

  get anyMenuOpen() {
    return this.menuOpenID !== false
  }

  closePeekOnChangeMenu = react(
    () => typeof this.menuOpenID === 'number',
    isChanging => {
      ensure('isChanging', isChanging)
      AppActions.clearPeek()
    },
  )

  showMenusBeforeOpen = react(
    () => this.anyMenuOpen,
    open => {
      ensure('open', open)
      window['electronRequire']('electron').remote.app.show()
    },
  )

  handleAppViewFocus = react(
    () => App.showingPeek,
    showingPeek => {
      ensure('showingPeek', showingPeek)
      setTrayFocused(true)
    },
  )

  get hoverId() {
    const { trayState } = App.state
    always(trayState.trayEventAt)
    const id = trayState.trayEvent.replace('TrayHover', '')
    if (id === 'Out') {
      return false
    }
    return +id
  }

  isHoveringIcon = react(
    () => {
      const { trayState } = App.state
      always(trayState.trayEventAt)
      return (
        trayState.trayEvent !== 'TrayHoverOut' && trayState.trayEvent.indexOf(`TrayHover`) === 0
      )
    },
    _ => _,
  )

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
    const id = this.lastOpenMenu
    const trayBounds = Desktop.state.operatingSystem.trayBounds
    const baseOffset = 25
    const offset = +id == id ? (+id + 1) * 25 + baseOffset : 120
    return trayBounds[0] + offset
  }

  // uses faster open so we can react to things quickly
  setMenuBounds = react(
    () => [this.hoverId, this.openQuick, this.menuCenter],
    ([menuID, open, menuCenter]) => {
      ensure('valid id', typeof this.hoverId === 'number')
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
            [+this.lastOpenMenu]: {
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
        await sleep(100)
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

  handleMouseEnter = () => {
    this.isHoveringDropdown = true
  }

  handleMouseLeave = () => {
    console.log('MOUSE LEAVE')
    this.isHoveringDropdown = false
  }
}

export function MenuLayer() {
  const { sourcesStore, settingStore } = React.useContext(StoreContext)
  const queryStore = useStore(QueryStore, { sourcesStore }, { debug: true })
  const selectionStore = useStore(SelectionStore, { queryStore }, { debug: true })
  const menuStore = useStore(MenuStore, { debug: true })
  const storeProps = {
    settingStore,
    sourcesStore,
    queryStore,
    selectionStore,
    menuStore,
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
  return (
    <StoreContext.Provider value={storeProps}>
      <Popover
        open={menuStore.openVisually}
        background
        width={width}
        towards="bottom"
        delay={0}
        top={0}
        distance={6}
        forgiveness={10}
        edgePadding={0}
        left={menuStore.menuCenter}
        maxHeight={300}
        elevation={6}
        theme="dark"
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
                id="0"
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
      </Popover>
    </StoreContext.Provider>
  )
}
