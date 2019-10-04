import { isEqual } from '@o/fast-compare'
import { Logger } from '@o/logger'
import { ChangeDesktopThemeCommand } from '@o/models'
import { App, Desktop, Electron } from '@o/stores'
import { createUsableStore, ensure, react, useStore } from '@o/use-store'
import { app, BrowserWindow, screen, systemPreferences } from 'electron'
import { reaction } from 'mobx'
import { join } from 'path'
import React, { useEffect } from 'react'

import { ROOT } from './constants'
import { ElectronShortcutManager } from './helpers/ElectronShortcutManager'
import { getDefaultAppBounds } from './helpers/getDefaultAppBounds'
import { getScreenSize } from './helpers/getScreenSize'
import { moveWindowToCurrentSpace } from './helpers/moveWindowToCurrentSpace'
import { Mediator } from './mediator'
import { OrbitAppWindow } from './OrbitAppWindow'

const log = new Logger('OrbitMainWindow')

const setScreenSize = () => {
  const screenSize = getScreenSize()
  log.verbose(`Updating screen size ${JSON.stringify(screenSize)}`)
  Electron.setState({ screenSize })
}

class OrbitMainWindowStore {
  props: {
    enabled: boolean
    window?: BrowserWindow
  } = {
    enabled: false,
    window: null,
  }

  alwaysOnTop = true
  hasMoved = false
  isReady = false
  bounds = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }
  initialBounds = null
  windowRef = null

  get orbitRef(): BrowserWindow | null {
    return (this.windowRef && this.windowRef.window) || null
  }

  updateScreenSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      log.info(`updateScreenSize`, this.props.enabled, screenSize)
      ensure('enabled', !!this.props.enabled)
      ensure('has size', screenSize[0] !== 0)
      const bounds = getDefaultAppBounds(screenSize)
      // update if never changed
      if (!this.initialBounds || isEqual(this.initialBounds, this.bounds)) {
        this.bounds = bounds
      }
      if (!this.initialBounds) {
        this.initialBounds = bounds
      }
    },
  )

  setSize = ([width, height]) => {
    this.hasMoved = true
    this.bounds.width = width
    this.bounds.height = height
  }

  setPosition = ([x, y]) => {
    this.hasMoved = true
    this.bounds.x = x
    this.bounds.y = y
  }

  handleRef = ref => {
    if (!ref) return
    this.windowRef = ref
  }

  onClose = () => {
    console.log('setting closable')
    if (this.windowRef) this.windowRef.closable = true
  }

  handleOrbitSpaceMove = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
      ensure('enabled', !!this.props.enabled)
      ensure('did move', !!moved)
      ensure('window', !!this.orbitRef)
      // wait for move to finish
      await sleep(150)
      // wait for showing
      await when(() => Electron.state.showOrbitMain)
      if (this.orbitRef) {
        moveWindowToCurrentSpace(this.orbitRef)
      }
    },
  )

  get show() {
    if (Electron.isMainWindow) {
      return (this.props.window || this.isReady) && Electron.state.showOrbitMain
    }
    return true
  }

  setIsReady = () => {
    this.isReady = true
  }
}

const orbitMainWindowStore = createUsableStore(OrbitMainWindowStore, {
  enabled: Electron.isMainWindow,
})
global['orbitMainWindowStore'] = orbitMainWindowStore

export function OrbitMainWindow(props: { restartKey?: any; window?: BrowserWindow }) {
  const { isMainWindow, windowId } = useStore(Electron)
  const store = orbitMainWindowStore.useStore()

  useEffect(() => {
    if (isMainWindow) {
      const globalShortcut = new ElectronShortcutManager({
        shortcuts: {
          toggleApp: 'Option+Space',
        },
        onShortcut: () => {
          console.log('got toggle shortcut')
          const showOrbitMain = !Electron.state.showOrbitMain
          Electron.setState({
            showOrbitMain,
          })
          if (showOrbitMain) {
            store.windowRef.window.show()
          }
        },
      })

      globalShortcut.registerShortcuts()

      const disableDuringShortcutCreation = reaction(
        () => App.orbitState.shortcutInputFocused,
        focused => {
          if (focused) {
            log.info('Removing global shortcut temporarily...')
            globalShortcut.unregisterShortcuts()
          } else {
            log.info('Restoring global shortcut...')
            globalShortcut.registerShortcuts()
          }
        },
      )

      return () => {
        disableDuringShortcutCreation()
        globalShortcut.unregisterShortcuts()
      }
    }
  }, [isMainWindow])

  useEffect(() => {
    orbitMainWindowStore.setProps({
      enabled: isMainWindow,
    })
  }, [isMainWindow])

  log.info(
    `render ${Electron.appConf.appRole} ${isMainWindow} ${windowId} ${store.show} ${
      store.isReady
    } ${JSON.stringify(store.bounds)}`,
  )

  useMainWindowEffects({ isMainWindow })

  // wait for screensize/measure
  if (!store.bounds.width) {
    return null
  }

  // TODO i think i need to make this toggle on show for a few ms, then go back to normal
  // or maybe simpler imperative API, basically need to bring it to front and then not have it hog the front
  // titleBarStyle="customButtonsOnHover"
  // want to fix top glint in dark mode?
  // titleBarStyle={isMainWindow ? 'customButtonsOnHover' : 'hiddenInset'}
  // // bugfix white border https://github.com/electron/electron/issues/15008#issuecomment-497498135
  // {...isMainWindow && {
  //   minimizable: false,
  //   maximizable: false,
  //   closable: false,
  // }}
  const windowProps = {
    key: props.restartKey,
    window: props.window,
    windowId,
    locationQuery: {
      ...(process.env.NODE_ENV !== 'development' && {
        renderMode: 'react.concurrent',
      }),
    },
    // alwaysOnTop: store.isReady ? [true, 'floating', 1] : false,
    show: store.isReady,
    opacity: store.show ? 1 : 0,
    ignoreMouseEvents: store.show ? false : true,
    onReadyToShow: store.setIsReady,
    onClose: store.onClose,
    focus: isMainWindow,
    forwardRef: store.handleRef,
    animateBounds: true,
    defaultBounds: store.bounds,
    onResize: store.setSize,
    onPosition: store.setPosition,
    onMove: store.setPosition,
  }

  if (process.env.NODE_ENV === 'development') {
    log.verbose(`windowProps: ${JSON.stringify(windowProps, null, 2)}`)
  }

  return <OrbitAppWindow {...windowProps} />
}

function useMainWindowEffects({ isMainWindow }) {
  // follow theme
  useEffect(() => {
    if (!isMainWindow) return
    const setOSTheme = () => {
      const theme = systemPreferences.isDarkMode() ? 'dark' : 'light'
      Mediator.command(ChangeDesktopThemeCommand, { theme })
    }
    setOSTheme()
    const id = systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      setOSTheme,
    )
    return () => {
      systemPreferences.unsubscribeNotification(id)
    }
  }, [isMainWindow])

  // follow screen size
  useEffect(() => {
    if (!isMainWindow) return
    setScreenSize()
    screen.on('display-metrics-changed', setScreenSize)
    return () => {
      screen.removeListener('display-metrics-changed', setScreenSize)
    }
  }, [isMainWindow])

  // set orbit icon in dev
  useEffect(() => {
    if (!isMainWindow) return
    if (process.env.NODE_ENV === 'development') {
      app.dock.setIcon(join(ROOT, 'resources', 'icons', 'appicon.png'))
    }
  }, [isMainWindow])
}
