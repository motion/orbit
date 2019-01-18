import { App } from '@mcro/stores'
import { FullScreen, Row, View } from '@mcro/ui'
import * as React from 'react'
import { IS_ELECTRON } from '../../../constants'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

export default function BrowserDebugTray({ children }: any) {
  if (IS_ELECTRON) {
    return children
  }
  return (
    <FullScreen>
      <Row justifyContent="center" alignItems="center" width="100%" background="#eee">
        <View
          onMouseLeave={() =>
            App.sendMessage(App, App.messages.TRAY_EVENT, { type: 'trayHovered', value: 'Out' })
          }
          flexFlow="row"
          height={28}
          alignItems="center"
          pointerEvents="auto"
        >
          <Target id={3} />
          <Target id={2} />
          <Target id={1} />
          <Target id={0} />
        </View>
      </Row>
      <View position="relative" flex={1}>
        {children}
      </View>
    </FullScreen>
  )
}

const Target = (props: { id: number }) => {
  const { menuStore } = useStoresSafe()
  return (
    <View
      onMouseEnter={() => {
        App.sendMessage(App, App.messages.TRAY_EVENT, { type: 'trayHovered', value: `${props.id}` })
      }}
      onClick={() => {
        console.log('pin', props.id)
        menuStore.togglePinnedOpen(props.id)
      }}
      width={16}
      height={16}
      margin={[0, 5]}
      borderRadius={100}
      background="#000"
    />
  )
}
