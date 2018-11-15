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

export const menuApps = ['search', 'lists', 'topics', 'people'] as AppType[]

export class MenuStore {
  props: {
    paneManagerStore: PaneManagerStore
  }

  height = 300
  isHoveringDropdown = false
  isPinnedOpen = false
  hoveringID = -1

  // see how this interacts with isOpenVisually
  activeMenuID = App.openMenu ? App.openMenu.id : false

  get isHoveringPeek() {
    return Desktop.hoverState.appHovered[0]
  }

  // source of truth!
  // resolve the actual open state quickly so isOpenFocus/isOpenVisually
  // can derive off the truth state that is the most quick
  isOpenFast = react(
    () => [
      this.holdingOption,
      this.isHoveringTray || this.isHoveringDropdown || this.isPinnedOpen || this.isHoveringPeek,
    ],
    async ([holdingOption, showMenu], { sleep }) => {
      if (holdingOption) {
        return true
      }
      if (!showMenu) {
        // this prevents it from closing the moment you leave, gives mouse some buffer
        await sleep(120)
      }
      return showMenu
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
    console.log('got event', key)
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

  setActiveMenuClosedOnClose = react(
    () => this.isOpenVisually,
    isOpen => {
      ensure('not open', !isOpen)
      this.activeMenuID = -1
    },
  )

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
      ensure('is number', typeof val === 'number')
      return +val
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
      if (activeMenuID !== -1) {
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
      ensure('this.activeMenuID is number', typeof this.activeMenuID === 'number')
      const width = 300
      App.setState({
        trayState: {
          menuState: {
            [+this.activeMenuID]: {
              open: true,
              position: [menuCenter - width / 2, 0],
              // TODO: get height from the height we calculate
              size: [width, 300],
            },
          },
        },
      })
    },
  )

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
  setHeight = (height: number) => {
    this.height = height
    App.setState({
      trayState: {
        menuState: {
          [this.activeOrLastActiveMenuID]: {
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
    () => this.shouldFocus,
    async (shouldFocus, { sleep }) => {
      ensure('this.searchInput', !!this.searchInput)
      ensure('shouldFocus', shouldFocus)
      await sleep()
      console.log('focusing...')
      this.searchInput.focus()
    },
    {
      deferFirstRun: true,
    },
  )
}
