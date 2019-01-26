import { react } from '@mcro/black'
import { Logger } from '@mcro/logger'
import { App } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { BrowserWindow } from 'electron'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import AppWindow from './AppWindow'

const log = new Logger('electron')

class AppWindowsStore {
  window: BrowserWindow = null

  peeksStateDebounced = react(
    () => App.peeksState,
    _ => JSON.parse(JSON.stringify(_)),
    // delay a little so we can finish syncing torn state
    {
      delay: 100,
    },
  )
}

export default observer(function AppsWindow() {
  const store = useStore(AppWindowsStore)
  const peeksState = store.peeksStateDebounced
  if (!peeksState) {
    return null
  }
  log.info(`Rendering apps ${peeksState.length}`)
  return peeksState.map(({ id }, index) => {
    return <AppWindow key={id} id={id} isPeek={index === 0} />
  })
})
