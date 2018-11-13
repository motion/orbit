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
import { Popover, View } from '@mcro/ui'
import { TrayActions } from '../../../actions/Actions'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { Searchable } from '../../../components/Searchable'
import { BrowserDebugTray } from './BrowserDebugTray'
import { IS_ELECTRON } from '../../../constants'

export type MenuAppProps = AppProps & { menuStore: MenuStore; menuId: number }

const panes = ['people', 'topics', 'lists']
const maxTransition = 180
const transition = `opacity ease-in 60ms, transform ease ${maxTransition}ms`
export const menuPad = 6

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
    () => this.isOpenFast,
    open => {
      ensure('open', open)
      if (IS_ELECTRON) {
        window['electronRequire']('electron').remote.app.show()
      }
    },
  )

  // handleAppViewFocus = react(
  //   () => App.showingPeek,
  //   showingPeek => {
  //     ensure('showingPeek', showingPeek)
  //     setTrayFocused(true)
  //   },
  // )

  get hoverID(): number | false {
    const { trayState } = App.state
    always(trayState.trayEventAt)
    const id = trayState.trayEvent.replace('TrayHover', '')
    return `${+id}` === id ? +id : false
  }

  get isHoveringIcon() {
    return typeof this.hoverID === 'number'
  }

  get holdingOption() {
    return Desktop.keyboardState.isHoldingOption
  }

  // resolve the actual open state quickly so isOpenFocus/isOpenVisually
  // can derive off the truth state that is the most quick
  isOpenFast = react(
    () => [this.holdingOption, this.isHoveringIcon || this.isHoveringDropdown],
    async ([holdingOption, hoveringMenu], { sleep, when }) => {
      if (holdingOption) {
        return true
      }
      // if hovering the app window keep it open until not
      if (Desktop.hoverState.appHovered[0]) {
        await when(() => !Desktop.hoverState.appHovered[0])
        // this prevents it from closing the moment you leave, gives mouse some buffer
        await sleep(60)
      }
      return hoveringMenu
    },
  )

  // the actual show/hide in the interface
  isOpenVisually = react(
    () => this.isOpenFast,
    async (open, { sleep }) => {
      // wait for "show" just a little before animation, but hide instantly to run before "hide"
      await sleep(open ? 100 : 0)
      console.log('ANIMTE NOW')
      return open
    },
  )

  shouldFocus = react(
    () => this.isOpenFast,
    async (open, { sleep }) => {
      // focus instantly on open, but wait for full close before defocus
      await sleep(open ? 0 : maxTransition * 1.2)
      console.log('FOCUS NOW')
      return open
    },
  )

  isFocused = react(
    () => this.shouldFocus,
    async (shouldFocus, { whenChanged, sleep }) => {
      if (!shouldFocus) {
        setTrayFocused(false)
        return false
      }
      if (Desktop.keyboardState.isHoldingOption) {
        // wait for pin to focus the menu
        await whenChanged(() => Electron.state.pinKey.at)
        console.log('GOT A PIN KEY', Electron.state.pinKey.name)
      }
      setTrayFocused(true)
      await sleep(32)
      return true
    },
    {
      deferFirstRun: true,
    },
  )

  get menuCenter() {
    const id = typeof this.hoverID === 'number' ? this.hoverID : this.lastOpenMenuID
    const trayBounds = Desktop.state.operatingSystem.trayBounds
    const baseOffset = 25
    const offset = +id == id ? (+id + 1) * 25 + baseOffset : 120
    const bounds = trayBounds[0] + offset
    return IS_ELECTRON ? bounds : bounds + window.innerWidth / 2
  }

  // uses faster open so we can react to things quickly
  setMenuBounds = react(
    () => [this.hoverID, this.isOpenFast, this.menuCenter],
    ([menuID, open, menuCenter]) => {
      ensure('valid id', typeof this.hoverID === 'number')
      const id = +menuID
      const width = 300
      log(`set open ${id} ${open}`)
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
    this.isHoveringDropdown = false
  }

  searchInput: HTMLInputElement = null

  handleSearchInput = (ref: HTMLInputElement) => {
    this.searchInput = ref
  }

  focusInputOnOpen = react(
    () => this.isFocused,
    async () => {
      ensure('this.searchInput', !!this.searchInput)
      ensure('this.isFocused', this.isFocused)
      this.searchInput.focus()
    },
    {
      deferFirstRun: true,
    },
  )
}

export const MenuLayer = React.memo(() => {
  const { sourcesStore, settingStore } = React.useContext(StoreContext)
  const queryStore = useStore(QueryStore, { sourcesStore })
  const selectionStore = useStore(SelectionStore, {
    queryStore,
    onClearSelection: () => {
      AppActions.clearPeek()
    },
  })
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

  React.useEffect(() => {
    // watch for mouse enter and leave
    const onMove = e => {
      const hoverOut = e.target === document.documentElement
      if (hoverOut) {
        menuStore.handleMouseLeave()
      } else {
        menuStore.handleMouseEnter()
      }
    }
    document.addEventListener('mousemove', onMove)
    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  const width = 300
  React.useEffect(() => {
    return App.onMessage(App.messages.TRAY_EVENT, async (key: keyof TrayActions) => {
      console.log('got event', key)
      switch (key) {
        case 'TrayToggleOrbit':
          AppActions.setOrbitDocked(!App.state.orbitState.docked)
          break
        case 'TrayToggle0':
        case 'TrayToggle1':
        case 'TrayToggle2':
          const index = +key.replace('TrayToggle', '')
          App.setState({
            trayState: {
              menuState: {
                [index]: {
                  pinned: !App.state.trayState.menuState[index],
                },
              },
            },
          })
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
  log(`MenuLayer left ${menuStore.menuCenter}`)
  return (
    <BrowserDebugTray>
      <StoreContext.Provider value={storeProps}>
        <MenuChrome
          width={width - menuPad * 2}
          margin={menuPad}
          transform={{ x: menuStore.menuCenter - width / 2, y: menuStore.isOpenVisually ? 0 : -5 }}
          transition={transition}
          opacity={menuStore.isOpenVisually ? 1 : 0}
        >
          <MenuChromeContent queryStore={queryStore} menuStore={menuStore} />
        </MenuChrome>
        <Popover
          open={menuStore.isOpenVisually}
          transition={transition}
          background
          width={width}
          towards="bottom"
          delay={0}
          top={IS_ELECTRON ? 0 : 28}
          distance={6}
          forgiveness={10}
          edgePadding={0}
          elevation={20}
          left={menuStore.menuCenter}
          maxHeight={window.innerHeight}
          theme="dark"
        >
          <div
            style={{
              height: menuStore.height,
            }}
          />
        </Popover>
      </StoreContext.Provider>
    </BrowserDebugTray>
  )
})

const MenuChrome = view(View, {
  height: window.innerHeight,
  position: 'absolute',
  zIndex: 100000,
  pointerEvents: 'auto',
  borderRadius: 6,
})

const MenuChromeContent = React.memo(
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
          {(['people', 'topics', 'lists'] as AppType[]).map((app, index) => (
            <MenuApp
              id={app}
              key={app}
              menuId={index}
              viewType="index"
              title={app}
              type={app}
              menuStore={menuStore}
            />
          ))}
        </Searchable>
      </View>
    )
  },
)
