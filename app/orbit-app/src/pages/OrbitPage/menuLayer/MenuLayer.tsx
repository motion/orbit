import * as React from 'react'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { Desktop, App } from '@mcro/stores'
import { View, FullScreen } from '@mcro/ui'

class MenuStore {
  showPin = false

  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  updateTray = react(
    () => App.state.trayState,
    ({ trayEvent }) => {
      console.log('event!', trayEvent)
    },
  )
}

export function MenuLayer(props) {
  const store = useStore(MenuStore, props)
  return (
    <FullScreen>
      <View width={100} height={100} background="rgba(255,0,0,0.5)">
        hello {store.showPin} {JSON.stringify(store.trayBounds)}
      </View>
    </FullScreen>
  )
}
