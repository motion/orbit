import * as React from 'react'
import { ChromeWindow } from './ChromeWindow'
import { App } from '@mcro/reactron'
import { devTools } from '../helpers/devTools'
import { AppWindows } from './AppWindows'

export function ChromeRoot() {
  return (
    <App onWillQuit={() => require('global').handleExit()} devTools={devTools}>
      <ChromeWindow />
      <AppWindows />
    </App>
  )
}
