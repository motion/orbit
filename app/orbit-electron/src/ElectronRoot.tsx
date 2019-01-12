import { App } from '@mcro/reactron'
import * as React from 'react'
import { ElectronStore } from './stores/ElectronStore'
import { devTools } from './helpers/devTools'
import { useStore } from '@mcro/use-store'

export const ElectronRoot = (props: { children: any }) => {
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
