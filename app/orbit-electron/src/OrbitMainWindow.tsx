import { Logger } from '@o/logger'
import { ChangeDesktopThemeCommand } from '@o/models'
import { Desktop, Electron } from '@o/stores'
import { ensure, react, useStore } from '@o/use-store'
import { app, BrowserWindow, screen, systemPreferences } from 'electron'
import { join } from 'path'
import React, { useEffect, useMemo } from 'react'

import { ROOT } from './constants'
import { getScreenSize } from './helpers/getScreenSize'
import { Mediator } from './mediator'
import { getDefaultAppBounds } from './helpers/getDefaultAppBounds'
import { OrbitAppWindow } from './OrbitAppWindow'
import { moveWindowToCurrentSpace } from './helpers/moveWindowToCurrentSpace'

const log = new Logger('OrbitMainWindow')
const isFirstOrbitWindow = Electron.appId === 0

const setScreenSize = () => {
  const screenSize = getScreenSize()
  log.info(`Updating screen size ${JSON.stringify(screenSize)}`)
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
  }

  orbitRef: BrowserWindow | null = null
  alwaysOnTop = true
  hasMoved = false
  isVisible = false
  size = [0, 0]
  position = [0, 0]
  initialState = {
    size: [0, 0],
    position: [0, 0],
  }

  updateSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      ensure('enabled', !!this.props.enabled)
      ensure('has size', screenSize[0] !== 0)
      if (this.size[0] !== 0) {
        ensure('not been moved yet', !this.hasMoved)
      }
      const bounds = getDefaultAppBounds(screenSize)
      this.position = bounds.position
      this.size = bounds.size
      this.initialState = {
        size: this.size,
        position: this.position,
      }
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
      focusApp(shown)
    },
  )

  get show() {
    if (Electron.appConf.appRole === 'main') {
      return this.isVisible ? Electron.state.showOrbitMain : false
    }
    return this.isVisible
  }

  setIsVisible = (next = true) => {
    log.info('setIsVisible', next)
    // show main window on first load
    if (isFirstOrbitWindow) {
      this.isVisible = next
    }
  }
}

export function OrbitMainWindow() {
  const { isMainWindow, appId } = useStore(Electron)
  const store = useStore(OrbitMainWindowStore, {
    enabled: isMainWindow,
  })

  log.info(
    `--- OrbitMainWindow ${Electron.appConf.appRole} ${appId} ${store.show}`,
    store.initialState,
  )

  useMainWindowEffects({ isMainWindow })

  // wait for screensize/measure
  if (!store.initialState.size[0]) {
    return null
  }

  return (
    <OrbitAppWindow
      appId={appId}
      show={store.show}
      onReadyToShow={() => store.setIsVisible()}
      // TODO i think i need to make this toggle on show for a few ms, then go back to normal
      // or maybe simpler imperative API, basically need to bring it to front and then not have it hog the front
      focus={isMainWindow}
      // alwaysOnTop={store.isVisible ? [store.alwaysOnTop, 'floating', 1] : false}
      forwardRef={store.handleRef}
      defaultPosition={store.initialState.position}
      defaultSize={store.initialState.size}
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
