import * as React from 'react'
import { react, ensure } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { Menu, BrowserWindow } from 'electron'
import root from 'global'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'

const log = new Logger('electron')
const Config = getGlobalConfig()

class OrbitWindowStore {
  orbitRef: BrowserWindow
  disposeShow = null
  alwaysOnTop = true
  hasMoved = false

  size = [0, 0]
  position = [0, 0]

  updateSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      let scl = 0.65
      let w = screenSize[0] * scl
      let h = screenSize[1] * scl
      // clamp width to not be too wide
      w = Math.min(h * 1.45, w)
      this.size = [w, h].map(x => Math.round(x))
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

  didMount() {
    // temp bugfix
    root['OrbitWindowStore'] = this
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

  handleFocus = () => {
    // avoid sending two show commands in a row in some cases
    const lm = Electron.bridge.lastMessage
    if (lm && lm.message === App.messages.SHOW) {
      console.log('last message', lm, Date.now() - lm.at)
      if (Date.now() - lm.at < 300) {
        console.log('avoid sending double "show" event when already opened')
        return
      }
    }
    Electron.sendMessage(App, App.messages.SHOW)
  }

  // just set this here for devtools opening,
  // we are doing weird stuff with focus
  handleElectronFocus = () => {
    Electron.setState({ focusedAppId: 'app' })
  }
}

export default observer(function OrbitWindow() {
  const store = useStore(OrbitWindowStore)
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
      onFocus={store.handleElectronFocus}
      showDevTools={Electron.state.showDevTools.app}
      transparent
      background="#00000000"
      vibrancy={App.state.darkTheme ? 'dark' : 'light'}
      hasShadow
    />
  )
})
