import { App } from '@o/reactron'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { devTools } from './helpers/devTools'
import { ElectronStore } from './stores/ElectronStore'

export default function ElectronRoot(props: { children: any }) {
  const electronStore = useStore(ElectronStore)

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
      ref={electronStore.handleAppRef}
      devTools={devTools}
    >
      {props.children}
    </App>
  )
}
