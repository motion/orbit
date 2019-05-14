import { App as ReactronApp } from '@o/reactron'
import { App } from '@o/stores'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { IS_MAIN_ORBIT } from '../constants'
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

  console.log('App.appConf', App.appConf)

  const isApp = !IS_MAIN_ORBIT
  const appId = `${App.appConf.appId || ''}`

  return (
    <ReactronApp
      onBeforeQuit={store.handleBeforeQuit}
      onWillQuit={store.handleQuit}
      ref={store.handleAppRef}
      devTools={devTools}
    >
      <MenuItems electronStore={store} />
      {isApp ? <OrbitAppWindow id={appId} appId={appId} showDevTools show /> : <OrbitMainWindow />}
    </ReactronApp>
  )
}
