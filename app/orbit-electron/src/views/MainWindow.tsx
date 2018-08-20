import * as React from 'react'
import { on, view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'
import { getScreenSize } from '../helpers/getScreenSize'
import { getConfig } from '../config'
import { logger } from '@mcro/logger'

const log = logger('electron')

class MainStore {
  get mouseInActiveArea() {
    return Electron.hoverState.peekHovered || Electron.hoverState.orbitHovered
  }
}

@view.attach('electronStore')
@view.provide({
  store: MainStore,
})
@view.electron
export class MainWindow extends React.Component<{
  store?: MainStore
  electronStore?: ElectronStore
  onRef?: Function
}> {
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
    const { store, electronStore, onRef } = this.props
    const url = getConfig().server.url
    log(`Rendering main window at url ${url}`)
    return (
      <Window
        alwaysOnTop
        ignoreMouseEvents={!store.mouseInActiveArea}
        ref={ref => ref && onRef(ref.window)}
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
