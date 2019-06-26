import { App as ReactronApp } from '@o/reactron'
import { App, Electron } from '@o/stores'
import { useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import * as React from 'react'

import { IS_MAIN_ORBIT } from '../constants'
import { devTools } from '../helpers/devTools'
import { ElectronDebugStore } from '../stores/ElectronDebugStore'
import { MenuItems } from './MenuItems'
import { OrbitAppWindow } from './OrbitAppWindow'
import { OrbitMainWindow } from './OrbitMainWindow'

export function OrbitRoot() {
  const debugStore = useStore(ElectronDebugStore)
  const electronStore = useStore(Electron)

  if (debugStore.error) {
    if (debugStore.error) {
      console.log('error is', debugStore.error)
    }
    return null
  }

  const isApp = !IS_MAIN_ORBIT
  const appId = `${selectDefined(App.appConf.appId, '')}`

  if (isApp && appId === '') {
    console.log(JSON.stringify(App.appConf.appId))
    throw new Error('No app id found!')
  }

  return (
    <ReactronApp
      onBeforeQuit={debugStore.handleBeforeQuit}
      onWillQuit={debugStore.handleQuit}
      devTools={devTools}
    >
      <MenuItems restart={debugStore.restart} />
      {electronStore.isMainWindow ? <OrbitMainWindow /> : <OrbitAppWindow id={appId} appId={appId} showDevTools show /> : }
    </ReactronApp>
  )
}
