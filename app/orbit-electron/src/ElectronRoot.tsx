import { App } from '@o/reactron'
import { useStore } from '@o/use-store'
import * as React from 'react'

import { devTools } from './helpers/devTools'
import { ElectronDebugStore } from './stores/ElectronDebugStore'

export default function ElectronRoot(props: { children: any }) {
  const electronStore = useStore(ElectronDebugStore)

  if (electronStore.error) {
    if (electronStore.error) {
      console.log('error is', electronStore.error)
    }
    return null
  }

  console.log('electron success, rendering...')

  return (
    <App
      onBeforeQuit={electronStore.handleBeforeQuit}
      onWillQuit={electronStore.handleQuit}
      devTools={devTools}
    >
      {props.children}
    </App>
  )
}
