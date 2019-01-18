import { always, ensure, react } from '@mcro/black'
import { AppType } from '@mcro/models'
import { App, Desktop, Electron } from '@mcro/stores'
import { debounce, memoize } from 'lodash'
import { createRef } from 'react'
import { AppActions } from '../../../actions/AppActions'
import { IS_ELECTRON, MENU_WIDTH } from '../../../constants'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { Direction } from '../../../stores/SelectionStore'
import { setTrayFocused } from './helpers'

export const menuApps = ['search', 'topics', 'people'] as AppType[]

export class MenuStore {
  props: {
    paneManagerStore: PaneManagerStore
    queryStore: QueryStore
  }

  menuRef = createRef<any>()
  menuPad = 6
  aboveHeight = 40
  isHoveringMenu = false
  isPinnedOpen = false
  hoveringID = -1
  didRenderState = { at: Date.now(), open: false }
  trayEventListener = App.onMessage(App.messages.TRAY_EVENT, a => this.handleTrayEvent(a))

  // see how this interacts with isOpen
  activeMenuID = App.openMenu ? App.openMenu.id : -1

  willUnmount() {
    this.trayEventListener()
  }

  get menuHeight() {
    return App.state.trayState.menuState[this.activeOrLastActiveMenuID].size[1]
  }

  get isHoveringMenuPeek() {
    if (this.activeMenuID === -1) {
      return false
    }
    return Desktop.hoverState.appHovered[0]
  }

  // debounce just a little to avoid isHoveringTray being false
  // before isHoveringMenu is true on mouse enter
  isHoveringTray = react(() => this.hoveringID > -1, _ => _, {
    delay: 60,
  })

  get isHoldingOption() {
    return Desktop.keyboardState.isHoldingOption
  }

  openState = react(
    () => this.isOpenFast,
    async (open, { sleep, setValue }) => {
      if (this.isRepositioning) {
        setValue({
          open: false,
          repositioning: true,
        })
        await sleep(100)
      }
      return { open, repositioning: false }
    },
    { defaultValue: { open: false, repositioning: false } },
  )

  // source of truth!
  // resolve the actual open state quickly so isOpen
  // can derive off the truth state that is the most quick
  isOpenFast = react(
    () => this.isHoldingOption || this.isHoveringTray || this.isHoveringMenu || this.isPinnedOpen,
    _ => _,
  )

  // the actual show/hide in the interface
  isOpenOutsideAnimation = react(
    () => this.isOpenFast,
    async (open, { whenChanged, effect }) => {
      await whenChanged(() => this.didRenderState)
      await effect(done => {
        // we wait for mutations to finish (animation)
        // debounce will wait for X ms before it considers animation complete
        const finish = debounce(done, 20)
        const m = new MutationObserver(finish)
        m.observe(this.menuRef.current, { attributes: true })
        return () => m.disconnect()
      })
      return open
    },
  )

  menuCenter = react(
    () => this.activeOrLastActiveMenuID,
    activeID => {
      const id = activeID === -1 ? 0 : activeID
      const maxItems = 3
      const trayPositionX = IS_ELECTRON
        ? Desktop.state.operatingSystem.trayBounds.position[0]
        : window.innerWidth / 2
      const leftSpacing = 47
      const xOffset = maxItems - id
      const extraSpace = 4
      const offset = xOffset * 28 + leftSpacing + (id === 0 ? extraSpace : 0)
      return trayPositionX + offset
    },
    {
      defaultValue: 0,
    },
  )

  get isRepositioning() {
    // if its "staying open"
    if (this.lastActiveMenuID !== -1) {
      return false
    }
    return this.lastMenuCenter !== this.menuCenter
  }

  lastMenuCenter = react(() => [this.menuCenter, this.isRepositioning], ([center]) => center, {
    delayValue: true,
  })

  onDidRender(open: boolean) {
    this.didRenderState = { at: Date.now(), open }
  }

  resetActiveMenuIDOnClose = react(
    () => this.isOpenOutsideAnimation,
    async (open, { sleep }) => {
      ensure('not open', !open)
      await sleep()
      this.activeMenuID = -1
    },
  )

  togglePinnedOpen(id: number) {
    this.activeMenuID = id
    this.setPinnedOpen(!this.isPinnedOpen)
  }

  setPinnedOpen(val: boolean) {
    this.isPinnedOpen = val
    // when you unpin, clear the hover state too
    if (!this.isPinnedOpen) {
      this.hoveringID = -1
    }
  }

  async handleTrayEvent({
    type,
    value,
  }: {
    type: 'trayHovered' | 'trayClicked'
    value: '0' | '1' | '2' | '3' | 'Out'
  }) {
    console.log('handleTrayEvent', type, value)
    if (type === 'trayHovered') {
      switch (value) {
        case 'Out':
          this.updateTrayHover(-1)
          break
        case '0':
        case '1':
        case '2':
        case '3':
          this.updateTrayHover(+value)
          break
      }
      return
    }

    if (type === 'trayClicked') {
      switch (value) {
        case '0':
          // special case: switch us over to the main orbit app
          // sync query over to search
          App.setState({ query: this.props.queryStore.query })
          // then open the main window to show it there instead
          AppActions.setOrbitDocked(!App.state.orbitState.docked)
          // and close this menu
          this.closeMenu()
          break
        case '1':
        case '2':
        case '3':
          this.togglePinnedOpen(+value)
          break
      }
    }
  }

  private updateHoverTm = null

  updateTrayHover = (id: number) => {
    clearTimeout(this.updateHoverTm)
    const update = () => {
      this.activeMenuID = id
      this.hoveringID = id
    }
    if (id === -1) {
      update()
    } else {
      // some debounce
      setTimeout(update, 80)
    }
  }

  setActiveMenuFromPaneChange = react(
    () => this.props.paneManagerStore.paneIndex,
    index => {
      ensure('changed', index !== this.activeMenuID)
      this.activeMenuID = index
    },
    {
      deferFirstRun: true,
    },
  )

  activeOrLastActiveMenuID = react(
    () => this.activeMenuID,
    val => {
      ensure('is active', val !== -1)
      return val
    },
    {
      defaultValue: 0,
      deferFirstRun: true,
    },
  )

  lastActiveMenuID = react(() => this.activeMenuID, _ => _, {
    delayValue: true,
    defaultValue: -1,
  })

  setAppMenuOpen = react(
    () => this.activeMenuID,
    activeMenuID => {
      if (activeMenuID === -1) {
        App.setState({
          trayState: {
            menuState: {
              [this.lastActiveMenuID]: { open: false },
            },
          },
        })
      } else {
        // this is used for electron to understand when to enable pointer events
        App.setState({
          trayState: {
            menuState: {
              [+activeMenuID]: {
                open: true,
              },
              [this.lastActiveMenuID]: {
                open: false,
              },
            },
          },
        })
      }
    },
  )

  setAppMenuBounds = react(
    () => this.menuCenter,
    menuCenter => {
      ensure('valid menu', this.activeMenuID !== -1)
      const id = +this.activeMenuID
      App.setState({
        trayState: {
          menuState: {
            [id]: {
              open: true,
              position: [menuCenter - MENU_WIDTH / 2, 0],
            },
          },
        },
      })
    },
  )

  menuHeightSetter = memoize((menuId: number) => (height: number) => {
    App.setState({
      trayState: {
        menuState: {
          [menuId]: {
            size: [MENU_WIDTH, height],
          },
        },
      },
    })
  })

  setPinnedFromPinKey = react(
    () => always(Electron.state.pinKey.at),
    () => {
      this.isPinnedOpen = true
    },
    {
      deferFirstRun: true,
    },
  )

  closeMenuOnEsc = react(() => Desktop.keyboardState.escapeDown, this.closeMenu, {
    deferFirstRun: true,
  })

  closeMenuOnPeekClose = react(
    () => App.isShowingPeek,
    async (shown, { when }) => {
      ensure('not shown', !shown)
      ensure('not typing something', !this.props.queryStore.hasQuery)
      await when(() => !this.isHoveringMenu)
      this.closeMenu()
    },
    {
      deferFirstRun: true,
    },
  )

  closeMenu() {
    this.isPinnedOpen = false
    this.isHoveringMenu = false
    this.hoveringID = -1
  }

  setActiveMenuFromPinMove = react(
    () => always(Electron.state.pinKey.at),
    () => {
      const towards = Electron.state.pinKey.name
      const inverse = towards === 'left' ? 'right' : 'left'
      console.log('inverse it', inverse)
      const direction = Direction[inverse]
      if (direction) {
        this.props.paneManagerStore.move(direction)
      }
    },
  )

  setActivePane = react(
    () => this.activeOrLastActiveMenuID,
    id => {
      if (typeof id === 'number') {
        const paneType = menuApps[id]
        this.props.paneManagerStore.setActivePaneByType(paneType)
      }
    },
  )

  closePeekOnChangeMenu = react(
    () => this.activeMenuID === -1,
    isClosed => {
      ensure('isClosed', isClosed)
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

  isMenuFullyHidden = false

  isFocused = react(
    () => this.isOpenOutsideAnimation,
    async (shouldFocus, { whenChanged, sleep }) => {
      if (!shouldFocus) {
        setTrayFocused(false)
        return false
      }
      if (this.isHoldingOption) {
        // wait for a certain key to break
        let pinnedKey
        while (!pinnedKey) {
          await whenChanged(() => Electron.state.pinKey.at)
          const { name } = Electron.state.pinKey
          // dont break on left/right
          if (name !== 'left' && name !== 'right' && name !== 'down') {
            pinnedKey = name
            this.isPinnedOpen = true
            if (this.searchInput.value === '') {
              this.searchInput.value = name
            }
          }
        }
        console.log('GOT A PIN KEY', pinnedKey)
      }
      setTrayFocused(true)
      await sleep(32)
      return true
    },
    {
      deferFirstRun: true,
    },
  )

  mouseEvent: 'enter' | 'leave' | null = null

  handleMouseEvent = react(
    () => this.mouseEvent,
    async (event, { sleep, when }) => {
      if (event === 'enter') {
        if (this.isOpenFast) {
          this.isHoveringMenu = true
        }
      }
      if (event === 'leave') {
        // give user some buffer to accidentally go outside bounds
        await sleep(50)
        // when the mouse enters into a peek window, we keep it alive
        await when(() => !this.isHoveringMenuPeek)
        // give user some buffer syncing state between hovering peek
        await sleep(50)
        this.isHoveringMenu = false
      }
    },
    {
      deferFirstRun: true,
    },
  )

  handleMouseEnter = () => {
    this.mouseEvent = 'enter'
  }

  handleMouseLeave = () => {
    this.mouseEvent = 'leave'
  }

  leaveMouseOnLeaveBounds = react(
    () => Desktop.hoverState.menuHovered,
    menuHovered => {
      ensure('not hovered', !menuHovered)
      this.handleMouseLeave()
    },
  )

  searchInput: HTMLInputElement = null

  handleSearchInput = (ref: HTMLInputElement) => {
    this.searchInput = ref
  }

  focusInputOnOpen = react(
    () => this.isFocused,
    async (isFocused, { sleep }) => {
      ensure('this.searchInput', !!this.searchInput)
      ensure('isFocused', isFocused)
      await sleep()
      this.searchInput.focus()
    },
    {
      deferFirstRun: true,
    },
  )
}
