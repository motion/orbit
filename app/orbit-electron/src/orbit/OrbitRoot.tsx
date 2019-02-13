import { App } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { app, clipboard } from 'electron'
import * as React from 'react'
import { devTools } from '../helpers/devTools'
import { ElectronStore } from '../stores/ElectronStore'
// import { observer } from 'mobx-react-lite'
import { MenuItems } from './MenuItems'
import OrbitWindow from './OrbitWindow'

export const OrbitRoot = () => {
  const electronStore = useStore(ElectronStore)

  React.useEffect(() => {
    return Electron.onMessage(msg => {
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

  console.log('orbit success, rendering...')

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
}
