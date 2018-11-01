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

class MenuStore {
  props: Props

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  open = react(() => App.state.trayState, state => state.trayEvent === `TrayHover${this.props.id}`)

  get menuCenter() {
    return (this.trayBounds[0] + this.trayBounds[1]) / 2 + (this.props.offsetX || 0)
  }

  setMenuBounds = react(
    () => [this.open, this.menuCenter],
    ([open, center]) => {
      const width = this.props.width
      App.setState({
        trayState: {
          menuState: {
            ...App.state.trayState.menuState,
            [this.props.id]: {
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
    >
      <Col overflowX="hidden" overflowY="auto" flex={1}>
        {props.children}
      </Col>
    </Popover>
  )
}
