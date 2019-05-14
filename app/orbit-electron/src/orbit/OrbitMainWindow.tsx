import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { ChangeDesktopThemeCommand, SendClientDataCommand } from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import { ensure, react, useStore } from '@o/use-store'
import { ChildProcess } from 'child_process'
import { app, BrowserWindow, screen, systemPreferences } from 'electron'
import root from 'global'
import { join } from 'path'
import * as React from 'react'

import { ROOT } from '../constants'
import { getScreenSize } from '../helpers/getScreenSize'
import { Mediator } from '../mediator'
import { getDefaultAppBounds } from './getDefaultAppBounds'
import { OrbitAppWindow } from './OrbitAppWindow'
import { OrbitShortcutsStore } from './OrbitShortcutsStore'

const log = new Logger('electron')
const Config = getGlobalConfig()

const setScreenSize = () => {
  Electron.setState({ screenSize: getScreenSize() })
}

function showOrbit(shown: boolean) {
  if (shown) {
    app.focus()
  } else {
    app.hide()
  }
}

export const appProcesses: { appId: number; process: ChildProcess }[] = []

// this is just temporary to get TearAppResolver to work
// @nate please help to fix it if following approach won't work
let orbitShortcutsStore
export const getOrbitShortcutsStore = () => {
  return orbitShortcutsStore
}

class OrbitMainWindowStore {
  orbitRef: BrowserWindow
  alwaysOnTop = true
  hasMoved = false
  initialShow = false
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
      console.log('bounds', bounds, screenSize)
      this.position = bounds.position
      this.size = bounds.size
    },
  )

  setSize = size => {
    this.hasMoved = true
    this.size = size
  }

  setPosition = position => {
    this.hasMoved = true
    this.position = position
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
      await when(() => App.orbitState.docked)
      this.showOnNewSpace()
    },
  )

  handleOrbitDocked = react(
    () => App.orbitState.docked,
    docked => {
      ensure('not torn', !Electron.isTorn)
      showOrbit(docked)
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
    return this.initialShow ? App.orbitState.docked : false
  }

  // just set this here for devtools opening,
  // we are doing weird stuff with focus
  handleFocus = () => {
    Electron.setState({ focusedAppId: 'app' })
  }

  setInitialShow = () => {
    this.initialShow = true
  }

  get showDevTools() {
    return Electron.state.showDevTools.app
  }
}

const onToggleOpen = () => {
  const shown = App.orbitState.docked
  console.log('TOGGLE', shown)
  showOrbit(shown)
  Mediator.command(SendClientDataCommand, {
    name: shown ? 'HIDE' : 'SHOW',
  })
}

export function OrbitMainWindow() {
  const store = useStore(OrbitMainWindowStore, null)
  root['OrbitMainWindowStore'] = store // helper for dev
  const url = `${Config.urls.server}`

  log.info(`--- OrbitMainWindow ${store.show} ${url} ${store.size} ${store.vibrancy}`)

  orbitShortcutsStore = useStore(OrbitShortcutsStore, {
    onToggleOpen,
  })

  // onMount
  React.useEffect(() => {
    store.start()
    orbitShortcutsStore.start()
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
      onReadyToShow={store.setInitialShow}
      focus
      alwaysOnTop={store.hasMoved ? false : [store.alwaysOnTop, 'floating', 1]}
      forwardRef={store.handleRef}
      file={url}
      defaultPosition={store.position.slice()}
      defaultSize={store.size.slice()}
      onResize={store.setSize}
      onPosition={store.setPosition}
      onMove={store.setPosition}
      onFocus={store.handleFocus}
      showDevTools={store.showDevTools}
      vibrancy={store.vibrancy}
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
    />
  )
}
