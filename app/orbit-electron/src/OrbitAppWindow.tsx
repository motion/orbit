import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Window } from '@o/reactron'
import { App, Electron } from '@o/stores'
import { react, useStore } from '@o/use-store'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { join } from 'path'
import { stringify } from 'query-string'
import * as React from 'react'

import { ROOT } from './constants'
import { getDefaultAppBounds } from './helpers/getDefaultAppBounds'

const log = new Logger('OrbitAppWindow')
const Config = getGlobalConfig()

class OrbitAppWindowStore {
  props: {
    windowId: number
  }

  show = false

  get bounds() {
    return getDefaultAppBounds(Electron.state.screenSize)
  }

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
    Electron.setState({
      focusedWindowId: this.props.windowId,
    })
  }

  setShown = () => {
    this.show = true
  }

  get showDevTools() {
    return Electron.state.showDevTools[this.props.windowId]
  }
}

type AppWindowProps = BrowserWindowConstructorOptions & {
  forwardRef?: any
  windowId: number
  size?: number[]
  onReadyToShow?: Function
  focus?: boolean
  onResize?: Function
  onMove?: Function
  onPosition?: Function
  defaultPosition?: number[]
  defaultSize?: number[]
  locationQuery?: Object
  window?: BrowserWindow
  bounds?: any
  defaultBounds?: any
  animateBounds?: boolean
}

export function OrbitAppWindow({
  windowId,
  forwardRef,
  locationQuery,
  ...windowProps
}: AppWindowProps) {
  const store = useStore(OrbitAppWindowStore, { windowId })
  const query = {
    id: windowId,
    ...locationQuery,
  }
  const url = `${Config.urls.server}/?${stringify(query)}`

  const size = windowProps.size || store.size

  log.info(`OrbitAppWindow ${windowId} ${url} ${size} ${store.position}`)

  if (!size[0]) {
    return null
  }

  return (
    <Window
      show={store.show}
      ref={forwardRef}
      file={url}
      webPreferences={{
        nodeIntegration: true,
        // webSecurity: false,
      }}
      titleBarStyle="hiddenInset"
      {...!(windowProps.defaultBounds && !windowProps.bounds) && {
        defaultPosition: store.position.slice(),
        defaultSize: store.size.slice(),
      }}
      onFocus={store.handleFocus}
      // showDevTools={store.showDevTools}
      // transparent
      // background="#00000000"
      // vibrancy={store.vibrancy}
      // hasShadow
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
      {...windowProps}
    />
  )
}
