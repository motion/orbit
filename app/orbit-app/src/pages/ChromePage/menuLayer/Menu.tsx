import * as React from 'react'
import { Popover, Col, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react, ensure } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
import { TrayActions } from '../../../actions/Actions'
import { MenusStore } from './MenuLayer'

type Props = {
  id: number
  width: number
  children: JSX.Element | ((isOpen: boolean) => JSX.Element)
  menusStore: MenusStore
}

class MenuStore {
  props: Props
  isHoveringMenu = false

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  isHoveringTray = react(
    () =>
      App.state.trayState.trayEventAt &&
      App.state.trayState.trayEvent === `TrayHover${this.props.id}`,
    _ => _,
    { onlyUpdateIfChanged: true },
  )

  get isAnotherMenuOpen() {
    return App.openMenu && App.openMenu.id !== this.props.id
  }

  open = react(
    () => [
      Desktop.isHoldingOption && this.props.menusStore.lastMenuOpen === this.props.id,
      this.isHoveringTray,
      this.isHoveringMenu,
      this.isAnotherMenuOpen,
    ],
    async (
      [shouldShowOnHoldingOption, hoveringTray, hoveringMenu, anotherMenuOpen],
      { sleep, when },
    ) => {
      // on holding option
      if (shouldShowOnHoldingOption) {
        // sleep a bit more to not be annoying
        await sleep(250)
        return true
      }
      // close if another menu opens
      if (anotherMenuOpen) {
        return false
      }
      if (this.open) {
        // sleep before closing
        await sleep(60)
      } else {
        // sleep before opening
        await sleep(100)
      }
      // if hovering the app window keep it open until not
      if (!anotherMenuOpen && Desktop.hoverState.appHovered[0]) {
        await when(() => !Desktop.hoverState.appHovered[0])
        await sleep(60)
      }
      return hoveringTray || hoveringMenu
    },
  )

  updateMenusStoreLastOpen = react(
    () => this.open,
    () => {
      ensure('this.open', this.open)
      this.props.menusStore.setLastOpen(this.props.id)
    },
  )

  get menuCenter() {
    const id = this.props.id
    const baseOffset = 25
    const offset = +id == id ? (+id + 1) * 25 + baseOffset : 120
    return this.trayBounds[0] + offset
  }

  setMenuBounds = react(
    () => [this.open, this.menuCenter],
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

  handleMouseEnter = () => {
    this.isHoveringMenu = true
  }

  handleMouseLeave = () => {
    this.isHoveringMenu = false
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
  const store = useStore(MenuStore, props)
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
  const open = store.open
  const left = store.menuCenter
  const width = props.width
  console.log('rendering menu', props.id, { open, store })
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
          {typeof props.children === 'function' ? props.children(open) : props.children}
        </Col>
      </View>
    </Popover>
  )
}
