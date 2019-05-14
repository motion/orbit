import { App } from '@o/reactron'
import { appInstanceConf } from '@o/stores'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { devTools } from '../helpers/devTools'
import { ElectronDebugStore } from '../stores/ElectronDebugStore'
import { MenuItems } from './MenuItems'
import { OrbitAppWindow } from './OrbitAppWindow'
import { OrbitMainWindow } from './OrbitMainWindow'

export function OrbitRoot() {
  const store = useStore(ElectronDebugStore)

  if (store.error) {
    if (store.error) {
      console.log('error is', store.error)
    }
    return null
  }

  const isApp = typeof appInstanceConf.appId === 'number'
  const appId = `${appInstanceConf.appId || ''}`

  return (
    <App
      onBeforeQuit={store.handleBeforeQuit}
      onWillQuit={store.handleQuit}
      ref={store.handleAppRef}
      devTools={devTools}
    >
      <MenuItems electronStore={store} />
      {isApp ? <OrbitAppWindow id={appId} appId={appId} showDevTools show /> : <OrbitMainWindow />}
    </App>
  )
}
