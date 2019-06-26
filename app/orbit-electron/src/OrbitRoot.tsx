import { App as ReactronApp } from '@o/reactron'
import { Electron } from '@o/stores'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { devTools } from './helpers/devTools'
import { ElectronDebugStore } from './stores/ElectronDebugStore'
import { MenuItems } from './MenuItems'
import { OrbitAppWindow } from './OrbitAppWindow'
import { OrbitMainWindow } from './OrbitMainWindow'
import { Logger } from '@o/logger'

const log = new Logger('OrbitRoot')

export function OrbitRoot() {
  const debugStore = useStore(ElectronDebugStore)
  const { isMainWindow, appConf, appId } = useStore(Electron)

  const isApp = appConf.type === 'app'

  log.info(`
    appId: ${appId} ${process.env.APP_ID}
    isMainWindow: ${isMainWindow}
    appConf.type: ${appConf.type}
    isApp: ${isApp}
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
      {/*
        This changes: when you open an app window, the main window turns into an app window.
        That lets the transition be seamless, we just launch a new main window in the background.
      */}
      {isMainWindow ? (
        <OrbitMainWindow />
      ) : (
        <OrbitAppWindow id={appId} appId={appId} showDevTools show />
      )}
    </ReactronApp>
  )
}
