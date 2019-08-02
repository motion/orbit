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

export function OrbitRoot() {
  const debugStore = useStore(ElectronDebugStore)
  const { isMainWindow, appConf, appId } = useStore(Electron)
  log.verbose(`
    appId: ${appId} ${process.env.APP_ID}
    isMainWindow: ${isMainWindow}
    appConf.type: ${appConf.appRole}
`)

  if (debugStore.error) {
    if (debugStore.error) {
      log.info('error is', debugStore.error)
    }
    return null
  }

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
