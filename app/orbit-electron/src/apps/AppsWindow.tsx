import * as React from 'react'
import { react } from '@mcro/black'
import { App } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import { AppWindow } from './AppWindow'
import { BrowserWindow } from 'electron'
import { observer } from 'mobx-react-lite'
import { useStore } from '@mcro/use-store'

const log = new Logger('electron')

class AppWindowsStore {
  window: BrowserWindow = null

  appsStateDebounced = react(
    () => App.appsState,
    _ => JSON.parse(JSON.stringify(_)),
    // delay a little so we can finish syncing torn state
    {
      delay: 100,
    },
  )
}

export default observer(function AppsWindow() {
  const store = useStore(AppWindowsStore)
  const appsState = store.appsStateDebounced
  if (!appsState) {
    return null
  }
  log.info(`Rendering apps ${appsState.length}`)
  return appsState.map(({ id }, index) => {
    return <AppWindow key={id} id={id} isPeek={index === 0} />
  })
})
