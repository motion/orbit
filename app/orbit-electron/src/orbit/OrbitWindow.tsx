import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { ChangeDesktopThemeCommand, SendClientDataCommand } from '@o/models'
import { Window } from '@o/reactron'
import { App, Desktop, Electron, appStartupConfig } from '@o/stores'
import { ensure, react, useStore } from '@o/use-store'
import { ChildProcess } from 'child_process'
import { app, BrowserWindow, Menu, screen, systemPreferences } from 'electron'
import root from 'global'
import { join } from 'path'
import * as React from 'react'
import { ROOT } from '../constants'
import { getScreenSize } from '../helpers/getScreenSize'
import { Mediator } from '../mediator'
import { OrbitShortcutsStore } from './OrbitShortcutsStore'

const log = new Logger('electron')
const Config = getGlobalConfig()

const setScreenSize = () => {
  Electron.setState({ screenSize: getScreenSize() })
}

export const appProcesses: { appId: number; process: ChildProcess }[] = []

// this is just temporary to get TearAppResolver to work
// @nate please help to fix it if following approach won't work
let orbitShortcutsStore
export const getOrbitShortcutsStore = () => {
  return orbitShortcutsStore
}

class OrbitWindowStore {
  orbitRef: BrowserWindow
  disposeShow = null
  alwaysOnTop = true
  hasMoved = false
  blurred = true
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
      ensure('not torn', !Electron.isTorn)
      // max initial size to prevent massive screen on huge monitor
      let scl = 0.8
      let w = screenSize[0] * scl
      let h = screenSize[1] * scl
      // clamp width to not be too wide
      w = Math.min(h * 1.4, w)
      const maxSize = [1440, 1024]
      const minSize = [800, 700]
      this.size = [w, h]
        .map(x => Math.round(x))
        .map((x, i) => Math.min(maxSize[i], x))
        .map((x, i) => Math.max(minSize[i], x))
      // centered
      const TOOLBAR_HEIGHT = 23
      this.position = [
        // width
        screenSize[0] / 2 - w / 2,
        // height
        screenSize[1] / 2 - h / 2 + TOOLBAR_HEIGHT,
      ].map(x => Math.round(x))
    },
  )

  setSize = (size, other) => {
    console.log('got a resize', other, size)
    // this.size = size
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
      if (!docked) {
        Menu.sendActionToFirstResponder('hide:')
      }
    },
  )

  get show() {
    if (Electron.isTorn) {
      return true
    }
    return this.initialShow ? App.orbitState.docked : false
  }

  showOnNewSpace() {
    console.log('Show on new space...')
    this.orbitRef.setVisibleOnAllWorkspaces(true) // put the window on all screens
    this.orbitRef.focus() // focus the window up front on the active screen
    this.orbitRef.setVisibleOnAllWorkspaces(false) // disable all screen behavior
  }

  // just set this here for devtools opening,
  // we are doing weird stuff with focus
  handleFocus = () => {
    this.blurred = false
    Electron.setState({ focusedAppId: 'app' })
  }

  handleBlur = () => {
    this.blurred = true
  }

  setInitialShow = () => {
    this.initialShow = true
  }

  get showDevTools() {
    return Electron.state.showDevTools.app
  }
}

export default function OrbitWindow() {
  const store = useStore(OrbitWindowStore, null)
  root['OrbitWindowStore'] = store // helper for dev

  const appQuery = `/?id=${appStartupConfig.appId}`
  const url = `${Config.urls.server}${appStartupConfig.appId > 0 ? appQuery : ''}`

  log.info(
    `--- OrbitWindow ${process.env.SUB_PROCESS} ${store.show} ${url} ${store.size} ${
      store.vibrancy
    }`,
  )

  orbitShortcutsStore = useStore(OrbitShortcutsStore, {
    onToggleOpen() {
      const shown = App.orbitState.docked
      console.log('ok', store.blurred, shown)
      if (store.blurred && shown) {
        store.orbitRef.focus()
        return
      }
      Mediator.command(SendClientDataCommand, {
        name: shown ? 'HIDE' : 'SHOW',
      })
    },
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
      onReadyToShow={store.setInitialShow}
      focus
      alwaysOnTop={store.hasMoved ? false : [store.alwaysOnTop, 'floating', 1]}
      ref={store.handleRef}
      file={url}
      position={store.position.slice()}
      size={store.size.slice()}
      onResize={store.setSize}
      onMove={store.setPosition}
      onFocus={store.handleFocus}
      onBlur={store.handleBlur}
      showDevTools={store.showDevTools}
      transparent
      background="#00000000"
      vibrancy={store.vibrancy}
      hasShadow
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
    />
  )
}
