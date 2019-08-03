import { Logger } from '@o/logger'
import { App as ReactronApp } from '@o/reactron'
import { Electron } from '@o/stores'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { devTools } from './helpers/devTools'
import { MenuItems } from './MenuItems'
import { OrbitMainWindow } from './OrbitMainWindow'
import { ElectronDebugStore } from './stores/ElectronDebugStore'

const log = new Logger('OrbitRoot')

const debugStore = new ElectronDebugStore()

export function OrbitRoot() {
  const { isMainWindow, appConf, appId } = useStore(Electron)
  log.verbose(`
    appId: ${appId} ${process.env.APP_ID}
    isMainWindow: ${isMainWindow}
    appConf.type: ${appConf.appRole}
`)

  return (
    <ReactronApp
      onBeforeQuit={debugStore.handleBeforeQuit}
      onWillQuit={debugStore.handleQuit}
      devTools={devTools}
    >
      <MenuItems restart={debugStore.restart} />
      <OrbitMainWindow />
    </ReactronApp>
  )
}
