import { ensure, react } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { Logger } from '@mcro/logger'
import { forceKillProcess, forkProcess } from '@mcro/orbit-fork-process'
import { Window } from '@mcro/reactron'
import { App, Desktop, Electron } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { ChildProcess } from 'child_process'
import { app, BrowserWindow, dialog, Menu, screen, systemPreferences } from 'electron'
import { pathExists } from 'fs-extra'
import root from 'global'
import { observer } from 'mobx-react-lite'
import { join } from 'path'
import * as React from 'react'
import { ROOT } from '../constants'
import { getScreenSize } from '../helpers/getScreenSize'
import { OrbitShortcutsStore } from './OrbitShortcutsStore'

const log = new Logger('electron')
const Config = getGlobalConfig()

const setScreenSize = () => {
  Electron.setState({ screenSize: getScreenSize() })
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
  appId = App.state.appCount

  didMount() {
    // screen events
    setScreenSize()
    screen.on('display-metrics-changed', async () => {
      log.info('got display metrics changed event')
      setScreenSize()
    })

    // theme events
    const updateTheme = () => {
      const theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
      console.log('sending theme', theme)
      Electron.sendMessage(Desktop, Desktop.messages.OS_THEME, theme)
    }
    updateTheme()
    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', updateTheme)
  }

  updateSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      ensure('not torn', !Electron.isTorn)
      // max initial size to prevent massive screen on huge monitor
      let scl = 0.76
      let w = screenSize[0] * scl
      let h = screenSize[1] * scl
      // clamp width to not be too wide
      w = Math.min(h * 1.4, w)
      const maxSize = [1600, 1100]
      const minSize = [900, 720]
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

  get show() {
    if (Electron.isTorn) {
      return true
    }
    return this.initialShow ? App.orbitState.docked : false
  }

  setInitialShow = () => {
    this.initialShow = true
  }
}

export default observer(function OrbitWindow() {
  const store = useStore(OrbitWindowStore)
  root['OrbitWindowStore'] = store // helper for dev

  const appQuery = `/?appId=${store.appId}`
  const url = `${Config.urls.server}${store.appId > 0 ? appQuery : ''}`
  const vibrancy = App.state.isDark ? 'ultra-dark' : 'light'

  log.info(
    `--- OrbitWindow ${process.env.SUB_PROCESS} ${store.show} ${url} ${store.size} ${vibrancy}`,
  )

  const orbitShortcutsStore = useStore(OrbitShortcutsStore, {
    onToggleOpen() {
      const shown = App.orbitState.docked
      console.log('ok', store.blurred, shown)
      if (store.blurred && shown) {
        store.orbitRef.focus()
        return
      }
      Electron.sendMessage(App, shown ? App.messages.HIDE : App.messages.SHOW)
    },
  })

  // onMount
  React.useEffect(() => {
    // set orbit icon in dev
    if (process.env.NODE_ENV === 'development') {
      app.dock.setIcon(join(ROOT, 'resources', 'icons', 'appicon.png'))
    }

    let appProcesses: { appId: number; process: ChildProcess }[] = []

    let disposers: Function[] = []

    // handle tear away
    disposers.push(
      Electron.onMessage(Electron.messages.TEAR_APP, async ({ appType, appId }) => {
        console.log('Tearing app', appType, appId)

        const iconPath = join(ROOT, 'resources', 'icons', `appicon-${appType}.png`)
        if (!(await pathExists(iconPath))) {
          dialog.showErrorBox('No icon found for app...', 'Oops')
          console.error('no icon!', iconPath)
          return
        }
        app.dock.setIcon(iconPath)
        Electron.setIsTorn()
        orbitShortcutsStore.dispose()

        const proc = forkProcess({
          name: 'orbit',
          // TODO we can increment for each new orbit sub-process, need a counter here
          // inspectPort: 9006,
          // inspectPortRemote: 9007,
        })

        appProcesses.push({ appId, process: proc })
      }),
    )

    disposers.push(
      Electron.onMessage(Electron.messages.CLOSE_APP, ({ appId }) => {
        const app = appProcesses.find(x => x.appId === appId)
        if (!app) {
          console.error('No process found for id', appId)
          return
        }
        forceKillProcess(app.process)
      }),
    )

    return () => {
      for (const disposer of disposers) {
        disposer()
      }
    }
  }, [])

  if (!store.size[0]) {
    return null
  }

  return (
    <Window
      show={store.show}
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
      showDevTools={Electron.state.showDevTools.app}
      transparent
      background="#00000000"
      vibrancy={vibrancy}
      hasShadow
      icon={join(ROOT, 'resources', 'icons', 'appicon.png')}
    />
  )
})
