import * as React from 'react'
import * as Constants from '../constants'
import { on, view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import * as Helpers from '../helpers'
import { Electron, Desktop, App } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'

class MainStore {
  get mouseInActiveArea() {
    return Desktop.hoverState.peekHovered || Desktop.hoverState.orbitHovered
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
    const screenSize = Helpers.getScreenSize()
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

  handleClose = e => {
    console.log('handling close...')
    if (App.peekState.item) {
      e.preventDefault()
      Electron.sendMessage(App, App.messages.HIDE_PEEK)
      return
    }
    if (App.orbitState.docked || !App.orbitState.hidden) {
      e.preventDefault()
      Electron.sendMessage(App, App.messages.HIDE)
    }
  }

  render() {
    const { store, electronStore, onRef } = this.props
    return (
      <Window
        alwaysOnTop
        ignoreMouseEvents={!store.mouseInActiveArea}
        ref={ref => ref && onRef(ref.window)}
        file={Constants.API_URL}
        show={electronStore.show ? this.state.show : false}
        opacity={electronStore.show === 1 ? 0 : 1}
        frame={false}
        hasShadow={false}
        showDevTools={Electron.state.showDevTools.app}
        transparent
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        position={this.state.position}
        size={Electron.state.screenSize}
        onMove={this.handleMove}
        onClose={this.handleClose}
      />
    )
  }
}
