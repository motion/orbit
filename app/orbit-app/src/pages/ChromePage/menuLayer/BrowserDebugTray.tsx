import { App } from '@mcro/stores'
import { FullScreen, Row, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { IS_ELECTRON } from '../../../constants'

class DebugTrayStore {
  props: { id: number }

  targetSetter = id => () => {
    App.sendMessage(App, App.messages.TRAY_EVENT, { type: 'trayHovered', value: id })
  }

  onLeave = this.targetSetter('Out')
}

export default observer(function BrowserDebugTray({ children, menuStore }: any) {
  const store = useStore(DebugTrayStore)
  if (IS_ELECTRON) {
    return children
  }
  return (
    <FullScreen>
      <Row justifyContent="center" alignItems="center" width="100%" background="#eee">
        <View
          onMouseLeave={store.onLeave}
          flexFlow="row"
          height={28}
          alignItems="center"
          pointerEvents="auto"
        >
          <Target id="3" store={store} menuStore={menuStore} />
          <Target id="2" store={store} menuStore={menuStore} />
          <Target id="1" store={store} menuStore={menuStore} />
          <Target id="0" store={store} menuStore={menuStore} />
        </View>
      </Row>
      <View position="relative" flex={1}>
        {children}
      </View>
    </FullScreen>
  )
})

const Target = ({ id, store, menuStore }) => {
  return (
    <View
      onMouseEnter={store.targetSetter(id)}
      onClick={() => {
        console.log('pin', id)
        menuStore.togglePinnedOpen(id)
      }}
      width={16}
      height={16}
      margin={[0, 5]}
      borderRadius={100}
      background="#000"
    />
  )
}
