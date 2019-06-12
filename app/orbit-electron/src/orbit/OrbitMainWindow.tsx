import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { ChangeDesktopThemeCommand } from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import { createUsableStore, ensure, react } from '@o/use-store'
import { app, BrowserWindow, screen, systemPreferences } from 'electron'
import { join } from 'path'
import * as React from 'react'

import { ROOT } from '../constants'
import { getScreenSize } from '../helpers/getScreenSize'
import { Mediator } from '../mediator'
import { getDefaultAppBounds } from './getDefaultAppBounds'
import { OrbitAppWindow } from './OrbitAppWindow'

const log = new Logger('electron')
const Config = getGlobalConfig()

const setScreenSize = () => {
  Electron.setState({ screenSize: getScreenSize() })
}

function focusApp(shown: boolean) {
  if (shown) {
    app.focus()
  } else {
    app.hide()
  }
}

class OrbitMainWindowStore {
  orbitRef: BrowserWindow
  alwaysOnTop = true
  hasMoved = false
  isVisible = false
  size = [0, 0]
  position = [0, 0]
  vibrancy = 'light'

  start() {
    // screen events
    setScreenSize()
    screen.on('display-metrics-changed', async () => {
      log.info('got display metrics changed event')
      setScreenSize()
    })

    // theme events
    const setOSTheme = () => {
      const theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
      Mediator.command(ChangeDesktopThemeCommand, { theme })
    }
    setOSTheme()
    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', setOSTheme)
  }

  // use reaction to allow us to modify it at runtime to test
  updateVibrancy = react(
    () => App.vibrancy,
    next => {
      this.vibrancy = next
    },
  )

  updateSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      ensure('has size', screenSize[0] !== 0)
      ensure('not torn', !Electron.isTorn)
      if (this.size[0] !== 0) {
        ensure('not been moved', !this.hasMoved)
      }
      const bounds = getDefaultAppBounds(screenSize)
      this.position = bounds.position
      this.size = bounds.size
    },
  )

  setSize = size => {
    this.hasMoved = true
    size
    // this.size = size
  }

  setPosition = position => {
    this.hasMoved = true
    position
    // this.position = position
  }

  handleRef = ref => {
    if (!ref) return
    this.orbitRef = ref.window
  }

  handleOrbitSpaceMove = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
      ensure('not torn', !Electron.isTorn)
      ensure('did move', !!moved)
      ensure('window', !!this.orbitRef)
      // wait for move to finish
      await sleep(150)
      // wait for showing
      await when(() => App.state.showOrbitMain)
      this.showOnNewSpace()
    },
  )

  handleShowOrbitMain = react(
    () => Electron.state.showMain,
    shown => {
      ensure('not torn', !Electron.isTorn)
      focusApp(shown)
    },
  )

  showOnNewSpace() {
    console.log('Show on new space...')
    this.orbitRef.setVisibleOnAllWorkspaces(true) // put the window on all screens
    this.orbitRef.focus() // focus the window up front on the active screen
    this.orbitRef.setVisibleOnAllWorkspaces(false) // disable all screen behavior
  }

  get show() {
    if (Electron.isTorn) {
      return true
    }
    return this.isVisible ? Electron.state.showOrbitMain : false
  }

  setIsVisible = (next: boolean) => {
    this.isVisible = next
  }

  get showDevTools() {
    return Electron.state.showDevTools.app
  }
}

export const orbitMainWindowStore = createUsableStore(OrbitMainWindowStore)

export function OrbitMainWindow() {
  const store = orbitMainWindowStore.useStore()
  const url = `${Config.urls.server}`

  log.info(`--- OrbitMainWindow ${store.show} ${url} ${store.size} ${store.vibrancy}`)

  // onMount
  React.useEffect(() => {
    store.start()
    // set orbit icon in dev
    if (process.env.NODE_ENV === 'development') {
      app.dock.setIcon(join(ROOT, 'resources', 'icons', 'appicon.png'))
    }
  }, [])

  // wait for screensize/measure
  if (!store.size[0]) {
    return null
  }

  return (
    <OrbitAppWindow
      id="app"
      show={store.show}
      onReadyToShow={() => store.setIsVisible(true)}
      focus
      alwaysOnTop={store.hasMoved ? false : [store.alwaysOnTop, 'floating', 1]}
      forwardRef={store.handleRef}
      file={url}
      defaultPosition={store.position.slice()}
      defaultSize={store.size.slice()}
      onResize={store.setSize}
      onPosition={store.setPosition}
      onMove={store.setPosition}
      showDevTools={store.showDevTools}
      vibrancy={store.vibrancy}
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
    />
  )
}
