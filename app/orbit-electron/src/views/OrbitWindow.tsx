import * as React from 'react'
import { on, view, react, ensure } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { getScreenSize } from '../helpers/getScreenSize'
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

  // looks at desktop appFocusState and then controls electron focus
  handleOrbitFocusExternal = react(
    () => Desktop.state.appFocusState[0],
    async (state, { sleep }) => {
      ensure('state', !!state)
      console.log('GOT EM', state)
      if (state.focused) {
        // it doesnt focus if we dont sleep here... :/
        console.log(1)
        await sleep()
        // turn off always on top before focus
        // otherwise, it brings all windows up to front
        this.alwaysOnTop = false
        console.log(2)
        await sleep()
        // then focus
        this.orbitRef.focus()
        console.log(3)
        // then turn always on top back on
        this.alwaysOnTop = true
      }
    },
  )

  handleOrbitFocus = react(
    () => App.orbitState.docked,
    docked => {
      const focusedOnAppWindow = typeof Electron.state.focusedAppId === 'number'
      ensure('focus off app window', !focusedOnAppWindow)
      if (!docked) {
        ensure('no apps open', App.appsState.length === 1)
        Menu.sendActionToFirstResponder('hide:')
      } else {
        // app.show()
        this.orbitRef.show()
      }
    },
    {
      deferFirstRun: true,
    },
  )

  showOnNewSpace() {
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
    Electron.setState({ focusedAppId: 'app' })
  }

  handleBlur = async () => {
    // dont hide during tear event...
    // Electron.sendMessage(App, App.messages.HIDE)
  }
}

@view.attach('electronStore')
@view.provide({
  store: OrbitWindowStore,
})
@view.electron
export class OrbitWindow extends React.Component<Props> {
  state = {
    show: false,
  }

  componentDidMount() {
    this.handleReadyToShow()
    on(this, setInterval(this.setScreenSize, 1000))
  }

  setScreenSize = () => {
    const screenSize = getScreenSize()
    Electron.setState({ screenSize })
  }

  handleReadyToShow = () => {
    this.setScreenSize()
    this.setState({
      show: true,
    })
  }

  render() {
    const { store, electronStore } = this.props
    const url = Config.urls.server
    log.info(`Rendering main window at url ${url}`)
    return (
      <Window
        alwaysOnTop={store.alwaysOnTop}
        ignoreMouseEvents={!Electron.hoverState.orbitHovered}
        ref={store.handleRef}
        file={url}
        position={[0, 0]}
        size={Electron.state.screenSize}
        show={electronStore.show ? this.state.show : false}
        opacity={electronStore.show === 1 ? 0 : 1}
        frame={false}
        hasShadow={false}
        onBlur={store.handleBlur}
        onFocus={store.handleFocus}
        // @ts-ignore
        showDevTools={Electron.state.showDevTools.app}
        transparent
        background="#00000000"
        webPreferences={{
          nativeWindowOpen: true,
          experimentalFeatures: true,
          transparentVisuals: true,
          allowRunningInsecureContent: false,
          webSecurity: false,
          // plugins: true,
          // scrollBounce: true,
          // offscreen: true,
        }}
      />
    )
  }
}
