import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Window } from '@o/reactron'
import { App, Electron } from '@o/stores'
import { react, useStore } from '@o/use-store'
import { join } from 'path'
import * as React from 'react'

import { ROOT } from './constants'
import { getDefaultAppBounds } from './helpers/getDefaultAppBounds'

const log = new Logger('OrbitAppWindow')
const Config = getGlobalConfig()

class OrbitAppWindowStore {
  props: {
    appId: string
  }

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

  // just set this here for devtools opening,
  // we are doing weird stuff with focus
  handleFocus = () => {
    Electron.setState({ focusedAppId: this.props.appId })
  }

  setShown = () => {
    this.show = true
  }

  get showDevTools() {
    return Electron.state.showDevTools[this.props.appId]
  }
}

export function OrbitAppWindow({ appId, forwardRef, ...windowProps }: { appId: number } & any) {
  const store = useStore(OrbitAppWindowStore, { appId })
  const appQuery = appId === 0 ? '' : `/?id=${appId}`
  const url = `${Config.urls.server}${appQuery}`
  const size = windowProps.size || store.size

  log.info(`OrbitAppWindow ${appId} ${url} ${size} ${store.position}`)

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
      titleBarStyle="customButtonsOnHover"
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
