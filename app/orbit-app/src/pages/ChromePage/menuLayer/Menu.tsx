import * as React from 'react'
import { Popover, Col } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'

type Props = {
  id: 'Pin' | 'Orbit' | 'Memory'
  width: number
  children: React.ReactNode
  offsetX?: number
}

class PinMenuStore {
  props: Props

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  showMenu = react(
    () => App.state.trayState,
    state => state.trayEvent === `TrayHover${this.props.id}`,
  )

  get menuCenter() {
    return (this.trayBounds[0] + this.trayBounds[1]) / 2 + (this.props.offsetX || 0)
  }

  setMenuBounds = react(
    () => this.menuCenter,
    center => {
      const width = this.props.width
      App.setState({
        trayState: {
          menuState: {
            [this.props.id]: {
              // TODO height
              width,
              left: center - width / 2,
            },
          },
        },
      })
    },
  )
}

export function Menu(props: Props) {
  const store = useStore(PinMenuStore, props)
  const open = store.showMenu
  const width = props.width
  const left = store.menuCenter
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
    >
      <Col overflowX="hidden" overflowY="auto" flex={1}>
        {props.children}
      </Col>
    </Popover>
  )
}
