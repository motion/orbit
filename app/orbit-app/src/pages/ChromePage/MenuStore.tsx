import { PaneManagerStore, QueryStore, useActiveApps } from '@o/kit'
import { App, Desktop } from '@o/stores'
import { createStoreContext, ensure, react } from '@o/use-store'
import { debounce } from 'lodash'
import { createRef } from 'react'

import { IS_ELECTRON, MENU_WIDTH } from '../../constants'
import { setTrayFocused } from './helpers'

class MenuStore {
  // @ts-ignore
  props: {
    paneManagerStore: PaneManagerStore
    queryStore: QueryStore
    menuItems: ({
      id: number
      index: number
    })[]
    onMenuHover?: (index: number) => any
  }

  mouseEvent: 'enter' | 'leave' | null = null
  menuRef = createRef<any>()
  menuPad = 6
  aboveHeight = 40
  isHoveringMenu = false
  didRenderState = { at: Date.now(), open: false }
  searchInput: HTMLInputElement | null = null
  isPinnedOpen = false
  hoveringIndex = -1
  activeMenuIndex = App.openMenu ? App.openMenu.id : -1

  // source of truth!
  // resolve the actual open state quickly so isOpen
  // can derive off the truth state that is the most quick
  isOpenFast = react(
    () => this.isHoldingOption || this.isHoveringTray || this.isHoveringMenu || this.isPinnedOpen,
    _ => _,
  )

  get menuHeight() {
    return App.state.trayState.menuState[this.activeOrLastActiveMenuIndex].size[1]
  }
  get isHoveringMenuPeek() {
    if (this.activeMenuIndex === -1) {
      return false
    }
    return Desktop.hoverState.appHovered[0]
  }

  // debounce just a little to avoid isHoveringTray being false
  // before isHoveringMenu is true on mouse enter
  isHoveringTray = react(
    () => this.hoveringIndex > -1,
    async (next, { sleep }) => {
      if (next === false) {
        await sleep(60)
      }
      return next
    },
  )

  get isHoldingOption() {
    return false
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
  )

  // the actual show/hide in the interface
  isOpenOutsideAnimation = react(
    () => this.isOpenFast,
    async (open, { whenChanged, useEffect }) => {
      await whenChanged(() => this.didRenderState)
      await useEffect(done => {
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
    () => {
      const id = this.activeOrLastActiveMenuIndex
      return id === -1 ? 0 : id
    },
    id => {
      const trayPositionX = IS_ELECTRON
        ? Desktop.state.operatingSystem.trayBounds.position[0]
        : window.innerWidth / 2
      const leftSpacing = 47
      const maxIndex = 3
      const xOffset = maxIndex - id
      const extraSpace = 4
      const offset = xOffset * 28 + leftSpacing + (id === 0 ? extraSpace : 0)
      return trayPositionX + offset
    },
  )

  private setActiveMenuIndex(index: number) {
    this.activeMenuIndex = index
  }

  get isRepositioning() {
    // if its "staying open"
    if (this.lastActiveMenuIndex !== -1) {
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
      this.setActiveMenuIndex(-1)
    },
    {
      lazy: true,
    },
  )

  togglePinnedOpen() {
    this.setPinnedOpen(this.activeMenuIndex, !this.isPinnedOpen)
  }

  setPinnedOpen(id: number, val: boolean = true) {
    this.setActiveMenuIndex(id)
    this.isPinnedOpen = val
    // when you unpin, clear the hover state too
    if (!this.isPinnedOpen) {
      this.hoveringIndex = -1
    }
  }

  private updateHoverTm = null

  private setHoveringIndex = (index: number) => {
    clearTimeout(this.updateHoverTm)
    const update = () => {
      this.setActiveMenuIndex(index)
      this.hoveringIndex = index
    }
    if (index === -1) {
      update()
    } else {
      // some debounce
      setTimeout(update, 80)
    }
  }

  activeOrLastActiveMenuIndex = react(() => this.activeMenuIndex, val => (val !== -1 ? val : 0))

  lastActiveMenuIndex = react(() => this.activeMenuIndex, _ => _, {
    delayValue: true,
    defaultValue: this.activeMenuIndex,
  })

  setAppMenuOpen = react(
    () => this.activeMenuIndex,
    activeMenuID => {
      if (activeMenuID === -1) {
        App.setState({
          trayState: {
            menuState: {
              [this.lastActiveMenuIndex]: { open: false },
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
              [this.lastActiveMenuIndex]: {
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
      ensure('valid menu', this.activeMenuIndex !== -1)
      const index = +this.activeMenuIndex
      App.setState({
        trayState: {
          menuState: {
            [index]: {
              open: true,
              position: [menuCenter - MENU_WIDTH / 2, 0],
            },
          },
        },
      })
    },
  )

  // closeMenuOnEsc = react(() => Desktop.state.keyboardState.escapeDown, this.closeMenu, {
  //   lazy: true,
  // })

  closeMenuOnPeekClose = react(
    () => App.isShowingPeek,
    async (shown, { when }) => {
      ensure('not shown', !shown)
      ensure('not typing something', !this.props.queryStore.hasQuery)
      await when(() => !this.isHoveringMenu)
      this.closeMenu()
    },
    {
      lazy: true,
    },
  )

  closeMenu() {
    this.isPinnedOpen = false
    this.isHoveringMenu = false
    this.hoveringIndex = -1
  }

  callOnMenuHover = react(
    () => this.activeOrLastActiveMenuIndex,
    index => {
      if (typeof index === 'number') {
        this.props.onMenuHover(index)
      }
    },
  )

  closePeekOnChangeMenu = react(
    () => this.activeMenuIndex === -1,
    isClosed => {
      ensure('isClosed', isClosed)
      // AppActions.clearPeek()
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

  isFocused = react(
    () => this.isOpenOutsideAnimation,
    async (shouldFocus, { sleep }) => {
      if (!shouldFocus) {
        setTrayFocused(false)
        return false
      }
      setTrayFocused(true)
      await sleep(32)
      return true
    },
    {
      lazy: true,
    },
  )

  handleTrayEvent = async (event: {
    type: 'trayHovered' | 'trayClicked'
    value: '0' | '1' | '2' | '3' | 'Out'
  }) => {
    console.log('handleTrayEvent', event)
    // the indexing is right to left in terms of the tray
    // where 0 is the rightmost (the orbit O)
    // and 3 is the leftmost (the down arrow)
    if (event.type === 'trayHovered') {
      switch (event.value) {
        // treat hovering ORBIT O as hover out since we dont show anything there
        case '0':
        case 'Out':
          this.setHoveringIndex(-1)
          break
        case '1':
        case '2':
        case '3':
          this.setHoveringIndex(+event.value)
          break
      }
      return
    }
    if (event.type === 'trayClicked') {
      switch (event.value) {
        case '0':
          // special case: switch us over to the main orbit app
          AppActions.setOrbitDocked(!App.state.orbitState.docked)
          // and close this menu
          this.closeMenu()
          break
        case '1':
        case '2':
        case '3':
          this.setPinnedOpen(+event.value)
          this.togglePinnedOpen()
          break
      }
    }
  }
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
      lazy: true,
    },
  )

  handleMouseEnter = () => {
    this.mouseEvent = 'enter'
  }
  handleMouseLeave = () => {
    this.mouseEvent = 'leave'
  }

  // leaveMouseOnLeaveBounds = react(
  //   () => Desktop.state.hoverState.menuHovered,
  //   menuHovered => {
  //     ensure('not hovered', !menuHovered)
  //     this.handleMouseLeave()
  //   },
  // )

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
      lazy: true,
    },
  )
}

export function useMenuApps() {
  const allApps = useActiveApps()
  const searchApp = allApps.find(x => x.identifier === 'search')
  return [
    // indices start at 1 because 0 = orbit O
    { ...searchApp, index: 1 },
    // {
    //   id: 100,
    //   index: 3,
    //   type: 'actions',
    //   name: 'Actions',
    // },
  ]
}

export const menuStore = createStoreContext(MenuStore)
export const useMenuStore = menuStore.useStore
export const useCreateMenuStore = menuStore.useCreateStore
export const ProvideMenuStore = menuStore.SimpleProvider
