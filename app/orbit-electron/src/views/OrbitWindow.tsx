import * as React from 'react'
import { on, view, react, ensure, sleep } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop, App } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { getScreenSize } from '../helpers/getScreenSize'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { BrowserWindow } from 'electron'

const log = new Logger('electron')
const Config = getGlobalConfig()

type Props = {
  store?: MainStore
  electronStore?: ElectronStore
  onRef?: Function
}

class MainStore {
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
      await sleep(100)
      // wait for showing
      await when(() => App.orbitState.docked)
      this.window.setVisibleOnAllWorkspaces(true) // put the window on all screens
      this.window.focus() // focus the window up front on the active screen
      this.window.setVisibleOnAllWorkspaces(false) // disable all screen behavior
    },
  )

  handleFocus = async () => {
    console.log('!! electron focus')
    Electron.sendMessage(App, App.messages.SHOW)
    await sleep(16)
    // ...then re-bring this up above swift
    this.window.show()
  }
}

@view.attach('electronStore')
@view.provide({
  store: MainStore,
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

  handleBlur = () => {
    console.log('hide on blur')
    if (process.env.NODE_ENV !== 'development') {
      Electron.sendMessage(App, App.messages.HIDE)
    }
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
        onBlur={this.handleBlur}
        onFocus={store.handleFocus}
      />
    )
  }
}
