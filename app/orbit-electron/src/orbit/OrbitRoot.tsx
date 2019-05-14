import { App } from '@o/reactron'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { appStartupConfig } from '../../../stores/_'
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

  const appId = `${appStartupConfig.appId || ''}`

  return (
    <App
      onBeforeQuit={electronStore.handleBeforeQuit}
      onWillQuit={electronStore.handleQuit}
      ref={electronStore.handleAppRef}
      devTools={devTools}
    >
      <MenuItems electronStore={electronStore} />
      {appId ? <OrbitAppWindow id={appId} appId={appId} /> : <OrbitMainWindow />}
    </App>
  )
}
