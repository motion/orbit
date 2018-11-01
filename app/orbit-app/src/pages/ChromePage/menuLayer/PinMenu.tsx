import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
import { View } from '@mcro/ui'
import { MenuItem } from './MenuItem'

class PinMenuStore {
  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  showMenu = react(() => App.state.trayState, state => state.trayEvent === 'TrayHoverPin')

  get menuCenter() {
    return (this.trayBounds[0] + this.trayBounds[1]) / 2
  }
}

export function PinMenu(props) {
  const store = useStore(PinMenuStore, props)
  const width = 250
  return (
    <View
      width={width}
      maxHeight={300}
      overflowX="hidden"
      overflowY="auto"
      background="#fff"
      borderBottomRadius={10}
      boxShadow={[[0, 0, 60, [0, 0, 0, 0.5]]]}
      position="absolute"
      top={0}
      left={store.menuCenter - width / 2}
      opacity={store.showMenu ? 1 : 0}
      transform={{
        x: store.showMenu ? 0 : -10,
      }}
      transition="all ease 200ms"
    >
      <MenuItem icon="😓">Lorem Ipsum</MenuItem>
      <MenuItem icon="🤬">Lorem Ipsum</MenuItem>
      <MenuItem icon="👺">Lorem Ipsum</MenuItem>
      <MenuItem icon="🙀">Lorem Ipsum</MenuItem>
      <MenuItem icon="🥶">Lorem Ipsum</MenuItem>
      <MenuItem icon="🗣">Lorem Ipsum</MenuItem>
    </View>
  )
}
