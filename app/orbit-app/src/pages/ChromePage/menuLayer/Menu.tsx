import * as React from 'react'
import { Popover, Col, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
import { TrayActions } from '../../../actions/Actions'

type Props = {
  index: number | 'Orbit'
  width: number
  children: JSX.Element | ((isOpen: boolean) => JSX.Element)
}

class MenuStore {
  props: Props
  isHoveringMenu = false

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  isHoveringTray = react(
    () => [App.state.trayState.trayEvent, App.state.trayState.trayEventAt],
    ([evt]) => {
      const isHovering = evt === `TrayHover${this.props.index}`
      return isHovering
    },
    {
      onlyUpdateIfChanged: true,
    },
  )

  get allMenusOpenState() {
    const state = App.state.trayState.menuState
    return Object.keys(state).map(key => state[key].open)
  }

  get isAnotherMenuOpen() {
    return this.allMenusOpenState.some((isOpen, index) => index !== this.props.index && isOpen)
  }

  open = react(
    () => [this.isHoveringTray, this.isHoveringMenu, this.isAnotherMenuOpen],
    async ([hoveringTray, hoveringMenu, anotherMenuOpen], { sleep, when }) => {
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

  get menuCenter() {
    const index = this.props.index
    const baseOffset = 17
    const offset = +index == index ? (+index + 1) * 25 + baseOffset : 120
    return this.trayBounds[0] + offset
  }

  setMenuBounds = react(
    () => [this.open, this.menuCenter],
    ([open, center]) => {
      const width = this.props.width
      App.setState({
        trayState: {
          menuState: {
            [this.props.index]: {
              open,
              height: 300,
              width,
              left: center - width / 2,
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
          sendTrayEvent(key, Date.now())
          break
        case 'TrayHoverOut':
          sendTrayEvent(key, Date.now())
          break
      }
    })
  }, [])
  const open = store.open
  const left = store.menuCenter
  const width = props.width
  console.log('rendering menu', open, store.isHoveringMenu, store.isHoveringTray)
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
