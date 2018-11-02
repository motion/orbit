import * as React from 'react'
import { Popover, Col } from '@mcro/ui'
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
    () => App.state.trayState,
    state => state.trayEvent === `TrayHover${this.props.index}`,
    {
      onlyUpdateIfChanged: true,
    },
  )

  open = react(
    () => [this.isHoveringTray, this.isHoveringMenu],
    ([hoveringTray, hoveringMenu]) => {
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
            ...App.state.trayState.menuState,
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
  return (
    <Popover
      open={open}
      background
      width={width}
      towards="bottom"
      top={0}
      distance={8}
      left={left}
      maxHeight={300}
      elevation={6}
      theme="dark"
      onMouseEnter={store.handleMouseEnter}
      onMouseLeave={store.handleMouseLeave}
    >
      <Col overflowX="hidden" overflowY="auto" flex={1}>
        {props.children}
      </Col>
    </Popover>
  )
}
