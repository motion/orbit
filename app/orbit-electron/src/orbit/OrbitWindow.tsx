import { ensure, react } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { Logger } from '@mcro/logger'
import { Window } from '@mcro/reactron'
import { App, Desktop, Electron } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { BrowserWindow, Menu } from 'electron'
import root from 'global'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { OrbitShortcutsStore } from './OrbitShortcutsStore'

const log = new Logger('electron')
const Config = getGlobalConfig()

class OrbitWindowStore {
  orbitRef: BrowserWindow
  disposeShow = null
  alwaysOnTop = true
  hasMoved = false
  blurred = true
  size = [0, 0]
  position = [0, 0]

  updateSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      // max initial size to prevent massive screen on huge monitor
      let scl = 0.75
      let w = screenSize[0] * scl
      let h = screenSize[1] * scl
      // clamp width to not be too wide
      w = Math.min(h * 1.45, w)
      const maxSize = [1600, 1000]
      this.size = [w, h].map(x => Math.round(x)).map((x, i) => Math.min(maxSize[i], x))
      // centered
      this.position = [screenSize[0] / 2 - w / 2, screenSize[1] / 2 - h / 2].map(x => Math.round(x))
    },
  )

  setSize = (size, other) => {
    console.log('got a resize', other, size)
    // this.size = size
  }

  setPosition = position => {
    this.hasMoved = true
    console.log('got a move', position)
    this.position = position
  }

  handleRef = ref => {
    if (!ref) {
      return
    }
    this.orbitRef = ref.window
  }

  handleOrbitSpaceMove = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
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
}

export default observer(function OrbitWindow() {
  const store = useStore(OrbitWindowStore)
  root['OrbitWindowStore'] = store // helper for dev

  // handle shortcuts
  useStore(OrbitShortcutsStore, {
    onToggleOpen() {
      const shown = App.orbitState.docked
      console.log('ok', store.blurred)
      if (store.blurred && shown) {
        store.orbitRef.focus()
        return
      }
      Electron.sendMessage(App, shown ? App.messages.HIDE : App.messages.SHOW)
    },
  })

  const [show, setShow] = React.useState(false)
  const url = Config.urls.server

  log.info(
    `---- render OrbitWindow show ${show} ${url} hovered? ${Desktop.hoverState.orbitHovered} ${
      store.size
    }`,
  )

  if (!store.size || !store.size[0]) {
    return null
  }

  return (
    <Window
      show={show ? App.orbitState.docked : false}
      focus
      onReadyToShow={() => setShow(true)}
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
      vibrancy={App.state.darkTheme ? 'dark' : 'light'}
      hasShadow
    />
  )
})
