import { App } from '@o/reactron'
import { appStartupConfig } from '@o/stores'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { devTools } from '../helpers/devTools'
import { ElectronStore } from '../stores/ElectronStore'
import { MenuItems } from './MenuItems'
import { OrbitAppWindow } from './OrbitAppWindow'
import { OrbitMainWindow } from './OrbitMainWindow'

export function OrbitRoot() {
  const electronStore = useStore(ElectronStore)

  if (electronStore.error) {
    if (electronStore.error) {
      console.log('error is', electronStore.error)
    }
    return null
  }

  const isApp = typeof appStartupConfig.appId === 'number'
  const appId = `${appStartupConfig.appId || ''}`

  return (
    <App
      onBeforeQuit={electronStore.handleBeforeQuit}
      onWillQuit={electronStore.handleQuit}
      ref={electronStore.handleAppRef}
      devTools={devTools}
    >
      <MenuItems electronStore={electronStore} />
      {isApp ? <OrbitAppWindow id={appId} appId={appId} showDevTools /> : <OrbitMainWindow />}
    </App>
  )
}
