import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { react, view } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
import { View, FullScreen, Theme, Row, Text } from '@mcro/ui'

class MenuStore {
  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  showPinTray = react(
    () => App.state.trayState,
    ({ trayEvent }) => {
      console.log('trayEvent', trayEvent)
      if (trayEvent === 'TrayHoverPin') {
        return true
      } else {
        return false
      }
    },
  )

  get pinTrayCenter() {
    return (this.trayBounds[0] + this.trayBounds[1]) / 2
  }
}

const RowItemFrame = view(Row, {
  padding: [5, 8],
  alignItems: 'center',
})

function RowItem(props) {
  return (
    <RowItemFrame>
      <Text size={1.2} alpha={0.8}>
        {props.children}
      </Text>
      <View flex={1} />
      <Text size={1.4}>{props.icon}</Text>
    </RowItemFrame>
  )
}

export function MenuLayer(props) {
  const store = useStore(MenuStore, props)
  const width = 250
  return (
    <Theme name="light">
      <FullScreen>
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
          left={store.pinTrayCenter - width / 2}
          opacity={store.showPinTray ? 1 : 0}
          transform={{
            x: store.showPinTray ? 0 : -10,
          }}
          transition="all ease 200ms"
        >
          <RowItem icon="😓">Lorem Ipsum</RowItem>
          <RowItem icon="🤬">Lorem Ipsum</RowItem>
          <RowItem icon="👺">Lorem Ipsum</RowItem>
          <RowItem icon="🙀">Lorem Ipsum</RowItem>
          <RowItem icon="🥶">Lorem Ipsum</RowItem>
          <RowItem icon="🗣">Lorem Ipsum</RowItem>
        </View>
      </FullScreen>
    </Theme>
  )
}
