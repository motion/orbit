import { isEqual } from '@o/fast-compare'
import { Logger } from '@o/logger'
import { ChangeDesktopThemeCommand } from '@o/models'
import { Desktop, Electron } from '@o/stores'
import { ensure, react, useStore } from '@o/use-store'
import { app, BrowserWindow, screen, systemPreferences } from 'electron'
import { join } from 'path'
import React, { useEffect } from 'react'

import { ROOT } from './constants'
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

function focusApp(shown: boolean) {
  if (shown) {
    app.focus()
  } else {
    app.hide()
  }
}

class OrbitMainWindowStore {
  props: {
    enabled: boolean
    window: BrowserWindow
  } = {
    enabled: false,
    window: null,
  }

  alwaysOnTop = true
  hasMoved = false
  isReady = false
  bounds = {
    size: [0, 0],
    position: [0, 0],
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

  setSize = size => {
    this.hasMoved = true
    this.bounds.size = size
  }

  setPosition = position => {
    this.hasMoved = true
    this.bounds.position = position
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

  handleShowOrbitMain = react(
    () => Electron.state.showOrbitMain,
    shown => {
      ensure('enabled', !!this.props.enabled)
      ensure('Electron.isMainWindow', Electron.isMainWindow)
      focusApp(shown)
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

export function OrbitMainWindow(props: { restartKey?: any; window?: BrowserWindow }) {
  const { isMainWindow, windowId } = useStore(Electron)
  const store = useStore(OrbitMainWindowStore, {
    enabled: isMainWindow,
    window: props.window,
  })
  global['OrbitMainWindowStore'] = OrbitMainWindowStore

  log.info(
    `render ${Electron.appConf.appRole} ${isMainWindow} ${windowId} ${store.show} ${JSON.stringify(
      store.bounds,
    )}`,
  )

  useMainWindowEffects({ isMainWindow })

  // wait for screensize/measure
  if (!store.bounds.size[0]) {
    return null
  }

  return (
    <OrbitAppWindow
      key={props.restartKey}
      window={props.window}
      windowId={windowId}
      locationQuery={{
        ...(process.env.NODE_ENV !== 'development' && {
          renderMode: 'react.concurrent',
        }),
      }}
      // titleBarStyle="customButtonsOnHover"
      show={store.show}
      onReadyToShow={store.setIsReady}
      onClose={store.onClose}
      // TODO i think i need to make this toggle on show for a few ms, then go back to normal
      // or maybe simpler imperative API, basically need to bring it to front and then not have it hog the front
      focus={isMainWindow}
      // want to fix top glint in dark mode?
      // titleBarStyle={isMainWindow ? 'customButtonsOnHover' : 'hiddenInset'}
      // // bugfix white border https://github.com/electron/electron/issues/15008#issuecomment-497498135
      // {...isMainWindow && {
      //   minimizable: false,
      //   maximizable: false,
      //   closable: false,
      // }}
      // alwaysOnTop={store.isReady ? [store.alwaysOnTop, 'floating', 1] : false}
      forwardRef={store.handleRef}
      animateBounds
      defaultBounds={{
        x: store.bounds.position[0],
        y: store.bounds.position[1],
        width: store.bounds.size[0],
        height: store.bounds.size[1],
      }}
      onResize={store.setSize}
      onPosition={store.setPosition}
      onMove={store.setPosition}
    />
  )
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
