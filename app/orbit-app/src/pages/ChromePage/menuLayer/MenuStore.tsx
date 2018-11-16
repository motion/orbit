import { Direction } from '../../../stores/SelectionStore'
import { setTrayFocused } from './helpers'
import { App, Desktop, Electron } from '@mcro/stores'
import { react, ensure, always } from '@mcro/black'
import { AppActions } from '../../../actions/AppActions'
import { TrayActions } from '../../../actions/Actions'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { IS_ELECTRON } from '../../../constants'
import { maxTransition } from './MenuLayer'
import { AppType } from '@mcro/models'
import { memoize } from 'lodash'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'

export const menuApps = ['search', 'lists', 'topics', 'people'] as AppType[]

export class MenuStore {
  props: {
    paneManagerStore: PaneManagerStore
    queryStore: QueryStore
  }

  menuWidth = 300
  isHoveringDropdown = false
  isPinnedOpen = false
  hoveringID = -1

  // see how this interacts with isOpen
  activeMenuID = App.openMenu ? App.openMenu.id : -1

  get menuHeight() {
    return App.state.trayState.menuState[this.activeOrLastActiveMenuID].size[1]
  }

  get isHoveringMenuPeek() {
    if (this.activeMenuID === -1) {
      return false
    }
    return Desktop.hoverState.appHovered[0]
  }

  // source of truth!
  // resolve the actual open state quickly so isOpen
  // can derive off the truth state that is the most quick
  isOpenFast = react(
    () =>
      this.holdingOption ||
      this.isHoveringTray ||
      this.isHoveringDropdown ||
      this.isPinnedOpen ||
      this.isHoveringMenuPeek,
    async (val, { sleep }) => {
      await sleep()
      return val
    },
  )

  // the actual show/hide in the interface
  isOpenOutsideAnimation = react(
    () => this.isOpenFast,
    async (open, { sleep }) => {
      await sleep(maxTransition)
      return open
    },
  )

  resetActiveMenuIDOnClose = react(
    () => this.isOpenOutsideAnimation,
    async (open, { sleep }) => {
      ensure('not open', !open)
      await sleep()
      this.activeMenuID = -1
    },
  )

  togglePinnedOpen() {
    this.setPinnedOpen(!this.isPinnedOpen)
  }

  setPinnedOpen(val) {
    this.isPinnedOpen = val
    // when you unpin, clear the hover state too
    if (!this.isPinnedOpen) {
      this.hoveringID = -1
    }
  }

  handleTrayEvent = async (key: keyof TrayActions) => {
    switch (key) {
      case 'TrayToggle0':
        AppActions.setOrbitDocked(!App.state.orbitState.docked)
        break
      case 'TrayToggle1':
      case 'TrayToggle2':
      case 'TrayToggle3':
        this.activeMenuID = +key.replace('TrayToggle', '')
        this.togglePinnedOpen()
        break
      case 'TrayHover0':
      case 'TrayHover1':
      case 'TrayHover2':
      case 'TrayHover3':
        const id = +key.replace('TrayHover', '')
        this.hoveringID = id
        this.activeMenuID = id
        break
      case 'TrayHoverOut':
        this.hoveringID = -1
        break
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

  lastActiveMenuID = react(() => this.activeMenuID, id => +id, {
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
              position: [menuCenter - this.menuWidth / 2, 0],
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
            size: [this.menuWidth, height],
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
      await when(() => !this.isHoveringDropdown)
      this.closeMenu()
    },
    {
      deferFirstRun: true,
    },
  )

  closeMenu() {
    this.isPinnedOpen = false
    this.isHoveringDropdown = false
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
        const pane = menuApps[id]
        this.props.paneManagerStore.setActivePane(pane)
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

  get isHoveringTray() {
    return this.hoveringID > -1
  }

  get holdingOption() {
    return Desktop.keyboardState.isHoldingOption
  }

  isFocused = react(
    () => this.isOpenOutsideAnimation,
    async (shouldFocus, { whenChanged, sleep }) => {
      if (!shouldFocus) {
        // for some reason this happens before animation finishes and requires a significant buffer, why?
        await sleep(150)
        setTrayFocused(false)
        return false
      }
      if (Desktop.keyboardState.isHoldingOption) {
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

  get menuCenter() {
    const maxItems = 3
    let id = this.activeOrLastActiveMenuID
    id = id === -1 ? 0 : id
    const trayBounds = Desktop.state.operatingSystem.trayBounds
    const leftSpacing = 47
    const xOffset = maxItems - id
    const extraSpace = 4
    const offset = xOffset * 28 + leftSpacing + (id === 0 ? extraSpace : 0)
    const bounds = trayBounds[0] + offset
    return IS_ELECTRON ? bounds : bounds + window.innerWidth / 2
  }

  handleMouseEnter = () => {
    this.isHoveringDropdown = true
  }

  handleMouseLeave = () => {
    this.isHoveringDropdown = false
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
      console.log('focusing...')
      this.searchInput.focus()
    },
    {
      deferFirstRun: true,
    },
  )
}
