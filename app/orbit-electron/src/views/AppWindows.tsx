import * as React from 'react'
import { view, compose, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import { AppWindow } from './AppWindow'
// @ts-ignore
import { BrowserWindow } from 'electron'

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

const decorator = compose(
  view.attach({
    store: AppWindowsStore,
  }),
  view.electron,
)

export const AppWindows = decorator(({ store }: { store: AppWindowsStore }) => {
  const appsState = store.appsStateDebounced
  if (!appsState) {
    return null
  }
  log.info(`Rendering apps ${appsState.length}`)
  return appsState.map(({ id }, index) => {
    return <AppWindow key={id} id={id} isPeek={index === 0} />
  })
})
