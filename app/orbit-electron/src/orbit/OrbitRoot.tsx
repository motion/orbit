import { App } from '@mcro/reactron'
import * as React from 'react'
import { MenuItems } from './MenuItems'
import { OrbitWindow } from './OrbitWindow'
import { ElectronStore } from '../stores/ElectronStore'
import { devTools } from '../helpers/devTools'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import { ShortcutsManager } from './ShortcutsManager'
import { Electron } from '@mcro/stores'
import { clipboard, app } from 'electron'

export const OrbitRoot = observer(() => {
  const electronStore = useStore(ElectronStore)

  React.useEffect(() => {
    new ShortcutsManager()
  }, [])

  React.useEffect(() => {
    Electron.onMessage(msg => {
      switch (msg) {
        case Electron.messages.COPY:
          clipboard.writeText(msg)
          return
        case Electron.messages.RESTART:
          app.relaunch()
          app.exit()
          return
      }
    })
  }, [])

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
      <MenuItems electronStore={electronStore} />
      <OrbitWindow />
    </App>
  )
})
