import { App } from '@o/reactron'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { devTools } from '../helpers/devTools'
import { ElectronStore } from '../stores/ElectronStore'
// import { observer } from 'mobx-react-lite'
import { MenuItems } from './MenuItems'
import OrbitWindow from './OrbitWindow'

export function OrbitRoot() {
  const electronStore = useStore(ElectronStore)

  if (electronStore.error) {
    if (electronStore.error) {
      console.log('error is', electronStore.error)
    }
    return null
  }

  return (
    <App
      onBeforeQuit={electronStore.handleBeforeQuit}
      onWillQuit={electronStore.handleQuit}
      ref={electronStore.handleAppRef}
      devTools={devTools}
    >
      <MenuItems electronStore={electronStore} />
      <OrbitWindow />
    </App>
  )
}
