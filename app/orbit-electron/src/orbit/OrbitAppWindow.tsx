import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Window } from '@o/reactron'
import { App, Electron } from '@o/stores'
import { react, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import * as React from 'react'

import { ROOT } from '../constants'
import { getDefaultAppBounds } from './getDefaultAppBounds'

const log = new Logger('electron')
const Config = getGlobalConfig()

class OrbitAppWindowStore {
  props: {
    id: string
  }

  win: BrowserWindow
  alwaysOnTop = true
  hasMoved = false
  show = false
  bounds = getDefaultAppBounds(Electron.state.screenSize)
  size = this.bounds.size
  position = this.bounds.position
  vibrancy = 'light'

  // use reaction to allow us to modify it at runtime to test
  updateVibrancy = react(
    () => App.vibrancy,
    next => {
      this.vibrancy = next
    },
  )

  handleRef = ref => {
    if (!ref) return
    this.win = ref.window
  }

  // just set this here for devtools opening,
  // we are doing weird stuff with focus
  handleFocus = () => {
    Electron.setState({ focusedAppId: this.props.id })
  }

  setShown = () => {
    this.show = true
  }

  get showDevTools() {
    return Electron.state.showDevTools[this.props.id]
  }
}

export function OrbitAppWindow({
  id,
  appId,
  forwardRef,
  ...windowProps
}: { id: string; appId?: string } & any) {
  const store = useStore(OrbitAppWindowStore, { id })
  const appQuery = `/?id=${appId}`
  const url = `${Config.urls.server}${appId ? appQuery : ''}`
  const show = selectDefined(windowProps.show, store.show)
  const size = windowProps.size || store.size

  log.info(`OrbitAppWindow ${appId} ${show} ${url} ${size} ${store.position}`)

  if (!size[0]) {
    return null
  }

  return (
    <Window
      show={store.show}
      webPreferences={{
        nodeIntegration: true,
        webSecurity: false,
      }}
      titleBarStyle="inset"
      onReadyToShow={store.setShown}
      ref={forwardRef || store.handleRef}
      file={url}
      defaultPosition={store.position.slice()}
      defaultSize={store.size.slice()}
      onFocus={store.handleFocus}
      showDevTools={store.showDevTools}
      transparent
      background="#00000000"
      vibrancy={store.vibrancy}
      hasShadow
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
      {...windowProps}
    />
  )
}
