import { App } from '@o/reactron'
import * as React from 'react'

import { devTools } from './helpers/devTools'
import { ElectronDebugStore } from './stores/ElectronDebugStore'

const debugStore = new ElectronDebugStore()

export default function ElectronRoot(props: { children: any }) {
  return (
    <App
      onBeforeQuit={debugStore.handleBeforeQuit}
      onWillQuit={debugStore.handleQuit}
      devTools={devTools}
    >
      {props.children}
    </App>
  )
}
