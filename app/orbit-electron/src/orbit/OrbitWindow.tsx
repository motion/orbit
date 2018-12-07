import * as React from 'react'
import { view, react, ensure, provide } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { Menu, BrowserWindow } from 'electron'
import root from 'global'

const log = new Logger('electron')
const Config = getGlobalConfig()

type Props = {
  store?: OrbitWindowStore
  electronStore?: ElectronStore
}

class OrbitWindowStore {
  props: Props
  orbitRef: BrowserWindow = null
  disposeShow = null
  alwaysOnTop = true
  hasMoved = false

  size = [0, 0]
  position = [0, 0]

  updateSize = react(
    () => Electron.state.screenSize,
    screenSize => {
      const scl = 0.65
      this.size = [screenSize[0] * scl, screenSize[1] * scl].map(x => Math.round(x))
      this.position = [this.size[0] / 4, 0].map(x => Math.round(x))
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

@provide({
  store: OrbitWindowStore,
})
@view
export class OrbitWindow extends React.Component<Props> {
  state = {
    show: false,
  }

  render() {
    const { store } = this.props
    const url = Config.urls.server

    log.info(`render OrbitWindow ${url} hovered? ${Desktop.hoverState.orbitHovered} ${store.size}`)

    if (!store.size || !store.size[0]) {
      return null
    }

    const show = this.state.show ? App.orbitState.docked : false

    return (
      <Window
        show={show}
        focus
        onReadyToShow={() => this.setState({ show: true })}
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
        vibrancy="light"
        hasShadow
      />
    )
  }
}
