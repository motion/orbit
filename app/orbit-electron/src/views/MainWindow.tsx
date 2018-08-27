import * as React from 'react'
import { on, view, react, ensure } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron, Desktop } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { getScreenSize } from '../helpers/getScreenSize'
import { getConfig } from '../config'
import { logger } from '@mcro/logger'

const log = logger('electron')

type Props = {
  store?: MainStore
  electronStore?: ElectronStore
  onRef?: Function
}

class MainStore {
  props: Props

  window = null

  get mouseInActiveArea() {
    return Electron.hoverState.peekHovered || Electron.hoverState.orbitHovered
  }

  handleRef = ref => {
    if (this.props.onRef) {
      this.props.onRef(ref.window)
    }
    this.window = ref.window
  }

  moveToNewSpace = react(
    () => Desktop.state.movedToNewSpace,
    () => {
      ensure('has window', !!this.window)
      this.window.setVisibleOnAllWorkspaces(true) // put the window on all screens
      this.window.focus() // focus the window up front on the active screen
      this.window.setVisibleOnAllWorkspaces(false) // disable all screen behavior
    },
  )
}

@view.attach('electronStore')
@view.provide({
  store: MainStore,
})
@view.electron
export class MainWindow extends React.Component<Props> {
  state = {
    show: false,
    position: [0, 0],
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

  handleMove = position => {
    this.setState({ position })
  }

  render() {
    const { store, electronStore } = this.props
    const url = getConfig().server.url
    log(`Rendering main window at url ${url}`)
    return (
      <Window
        alwaysOnTop
        ignoreMouseEvents={!store.mouseInActiveArea}
        ref={store.handleRef}
        file={url}
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
        position={this.state.position}
        size={Electron.state.screenSize}
        onMove={this.handleMove}
      />
    )
  }
}
