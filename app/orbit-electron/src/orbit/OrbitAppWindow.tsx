import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Window } from '@o/reactron'
import { App, Electron } from '@o/stores'
import { react, useStore } from '@o/use-store'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import * as React from 'react'

import { ROOT } from '../constants'
import { getDefaultAppBounds } from './getDefaultAppBounds'

const log = new Logger('electron')
const Config = getGlobalConfig()

const bounds = getDefaultAppBounds(Electron.state.screenSize)

class OrbitAppWindowStore {
  props: {
    id: string
  }

  win: BrowserWindow
  alwaysOnTop = true
  hasMoved = false
  show = false
  size = bounds.size
  position = bounds.position
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
  ...windowProps
}: { id: string; appId?: string } & any) {
  const store = useStore(OrbitAppWindowStore, { id })
  const appQuery = `/?id=${appId}`
  const url = `${Config.urls.server}${appId ? appQuery : ''}`

  log.info(`OrbitAppWindow ${process.env.SUB_PROCESS} ${store.show} ${url} ${store.size}`)

  if (!store.size[0]) {
    return null
  }

  return (
    <Window
      show={store.show}
      webPreferences={{
        nodeIntegration: true,
        webSecurity: false,
      }}
      titleBarStyle="customButtonsOnHover"
      onReadyToShow={store.setShown}
      ref={store.handleRef}
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
