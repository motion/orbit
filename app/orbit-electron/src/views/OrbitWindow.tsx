import * as React from 'react'
import { on, view, react, ensure } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { getScreenSize } from '../helpers/getScreenSize'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { BrowserWindow } from 'electron'
import { sleep } from '@mcro/black'

const log = new Logger('electron')
const Config = getGlobalConfig()

type Props = {
  store?: OrbitWindowStore
  electronStore?: ElectronStore
  onRef?: Function
}

class OrbitWindowStore {
  props: Props

  window: BrowserWindow = null

  handleRef = ref => {
    if (!ref) {
      return
    }
    if (this.props.onRef) {
      this.props.onRef(ref.window)
    }
    this.window = ref.window
  }

  disposeShow = null

  moveToNewSpace = react(
    () => Desktop.state.movedToNewSpace,
    async (moved, { sleep, when }) => {
      ensure('did move', !!moved)
      ensure('has window', !!this.window)
      // wait for move to finish
      await sleep(150)
      // wait for showing
      await when(() => App.orbitState.docked)
      this.showOnNewSpace()
    },
  )

  showOnNewSpace() {
    this.window.setVisibleOnAllWorkspaces(true) // put the window on all screens
    this.window.focus() // focus the window up front on the active screen
    this.window.setVisibleOnAllWorkspaces(false) // disable all screen behavior
  }

  handleFocus = () => {
    Electron.sendMessage(App, App.messages.SHOW)
    Electron.setState({ focusedAppId: 'app' })
  }

  handleBlur = async () => {
    Electron.sendMessage(App, App.messages.HIDE)
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
        alwaysOnTop
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
