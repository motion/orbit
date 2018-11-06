import * as React from 'react'
import { Popover, Col, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'

type Props = {
  index: number | 'Orbit'
  width: number
  children: React.ReactNode
}

class MenuStore {
  props: Props
  isHoveringMenu = false

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  isHoveringTray = react(
    () => [App.state.trayState.trayEvent, App.state.trayState.trayEventAt],
    ([evt]) => evt === `TrayHover${this.props.index}`,
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
      // if open now, delay just a bit before closing
      if (this.open) {
        await sleep(60)
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

export function Menu(props: Props) {
  const store = useStore(MenuStore, props)
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
          {props.children}
        </Col>
      </View>
    </Popover>
  )
}
