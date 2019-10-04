import { Logger } from '@o/logger'
import { App as ReactronApp } from '@o/reactron'
import { Electron } from '@o/stores'
import { useStore } from '@o/use-store'
import { BrowserWindow } from 'electron'
import React, { useState } from 'react'

import { devTools } from './helpers/devTools'
import { MenuItems } from './MenuItems'
import { OrbitMainWindow } from './OrbitMainWindow'

const log = new Logger('OrbitRoot')

export function OrbitRoot(props: { loadingWindow: BrowserWindow }) {
  const { isMainWindow, appConf, windowId } = useStore(Electron)
  const [state, setState] = useState({
    restartKey: 0,
  })
  log.verbose(
    `windowId: ${windowId} ${process.env.WINDOW_ID}, isMainWindow: ${isMainWindow}, appConf.type: ${
      appConf.appRole
    }`,
  )
  return (
    <ReactronApp
      onWillQuit={() => {
        require('global').handleExit()
      }}
      devTools={devTools}
    >
      <MenuItems
        restart={() => setState(state => ({ ...setState, restartKey: state.restartKey + 1 }))}
      />
      {/* <OrbitActionsAppWindow /> */}
      <OrbitMainWindow window={props.loadingWindow} restartKey={state.restartKey} />
    </ReactronApp>
  )
}
