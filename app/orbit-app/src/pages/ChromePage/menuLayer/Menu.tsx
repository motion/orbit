import * as React from 'react'
import { Popover, Col, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App, Electron } from '@mcro/stores'
import { TrayActions } from '../../../actions/Actions'
import { MenusStore } from './MenuLayer'
import { setTrayFocused } from './helpers'

type Props = {
  id: number
  width: number
  children: JSX.Element | ((isOpen: boolean, store: MenuStore) => JSX.Element)
  menusStore: MenusStore
}

class MenuStore {
  props: Props
  isHoveringDropdown = false
  searchInput: HTMLInputElement = null

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  isHoveringIcon = react(
    () =>
      App.state.trayState.trayEventAt &&
      App.state.trayState.trayEvent === `TrayHover${this.props.id}`,
    _ => _,
    { onlyUpdateIfChanged: true },
  )

  get isAnotherMenuOpen() {
    return (App.openMenu && App.openMenu.id !== this.props.id) || false
  }

  get isPreviewingThisMenu() {
    return (
      Desktop.isHoldingOption &&
      !this.isAnotherMenuOpen &&
      this.props.menusStore.lastOpenMenu === this.props.id
    )
  }

  openQuick = react(
    () => [
      this.isPreviewingThisMenu,
      this.isHoveringIcon || this.isHoveringDropdown,
      this.isAnotherMenuOpen,
    ],
    async ([isPreviewingThisMenu, hoveringMenu, anotherMenuOpen], { sleep, when }) => {
      // on holding option
      if (isPreviewingThisMenu) {
        await sleep(50)
        return true
      }
      // close if another menu opens
      if (anotherMenuOpen) {
        return false
      }
      // if hovering the app window keep it open until not
      if (!anotherMenuOpen && Desktop.hoverState.appHovered[0]) {
        await when(() => !Desktop.hoverState.appHovered[0])
        await sleep(60)
      }
      return hoveringMenu
    },
  )

  openVisually = react(
    () => this.openQuick,
    async (open, { sleep }) => {
      if (open) {
        if (!this.isAnotherMenuOpen) {
          // sleep before closing
          await sleep(50)
        }
      } else {
        // sleep before opening
        await sleep(100)
      }
      return open
    },
  )

  get menuCenter() {
    const id = this.props.id
    const baseOffset = 25
    const offset = +id == id ? (+id + 1) * 25 + baseOffset : 120
    return this.trayBounds[0] + offset
  }

  // uses faster open so we can react to things quickly
  setMenuBounds = react(
    () => [this.openQuick, this.menuCenter],
    ([open, center]) => {
      const width = this.props.width
      App.setState({
        trayState: {
          menuState: {
            [this.props.id]: {
              open,
              position: [center - width / 2, 0],
              // TODO: determine this dynamically
              size: [this.props.width, 300],
            },
          },
        },
      })
    },
  )

  handleSearchInput = (ref: HTMLInputElement) => {
    this.searchInput = ref
  }

  menuFocus = react(
    () => this.openVisually,
    async (open, { sleep, whenChanged }) => {
      if (!open) {
        await sleep(100)
        if (!this.isAnotherMenuOpen) {
          setTrayFocused(false)
        }
        return false
      }
      if (Desktop.isHoldingOption) {
        // wait for pin to focus the menu
        await whenChanged(() => Electron.state.pinKey.at)
        console.log('GOT A PIN KEY', Electron.state.pinKey.name)
      }
      setTrayFocused(true)
      await sleep()
      if (this.searchInput) {
        this.searchInput.focus()
      }
      return true
    },
    {
      deferFirstRun: true,
    },
  )

  handleMouseEnter = () => {
    this.isHoveringDropdown = true
  }

  handleMouseLeave = () => {
    this.isHoveringDropdown = false
  }
}

const sendTrayEvent = (key, value) => {
  App.setState({
    trayState: {
      trayEvent: key,
      trayEventAt: value,
    },
  })
}

export function Menu(props: Props) {
  const store = useStore(MenuStore, props, { debug: true })
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
  const open = store.openVisually
  const left = store.menuCenter
  const width = props.width
  return (
    <Popover
      open={open}
      background
      width={width}
      towards="bottom"
      delay={0}
      top={0}
      distance={8}
      forgiveness={8}
      left={left}
      maxHeight={300}
      elevation={6}
      theme="dark"
    >
      <View
        onMouseEnter={store.handleMouseEnter}
        onMouseLeave={store.handleMouseLeave}
        padding={10}
        margin={-10}
        flex={1}
      >
        <Col overflowX="hidden" overflowY="auto" flex={1} className="app-parent-bounds">
          {typeof props.children === 'function' ? props.children(open, store) : props.children}
        </Col>
      </View>
    </Popover>
  )
}
