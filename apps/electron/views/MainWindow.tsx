import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import * as Helpers from '~/helpers'
import { Electron, Desktop } from '@mcro/all'
import { ElectronStore } from '~/stores'

class MainStore {
  get mouseInActiveArea() {
    return Desktop.hoverState.peekHovered || Desktop.hoverState.orbitHovered
  }
}

// @ts-ignore
@view.attach('electronStore')
// @ts-ignore
@view.provide({
  store: MainStore,
})
// @ts-ignore
@view.electron
export default class MainWindow extends React.Component {
  props: {
    store: MainStore
    electronStore: ElectronStore
  }

  state = {
    show: false,
    position: [0, 0],
  }

  componentDidMount() {
    this.handleReadyToShow()
    console.log('MOUNTED')
  }

  handleReadyToShow = () => {
    console.log('Helpers.getScreenSize()', Helpers.getScreenSize())
    this.setState({
      size: Helpers.getScreenSize(),
      show: true,
    })
  }

  handleMove = position => {
    this.setState({ position })
  }

  render() {
    const { store, electronStore, onRef } = this.props
    if (!this.state.size) {
      return null
    }
    console.log('electronStore.show', electronStore.show)
    return (
      <Window
        alwaysOnTop
        ignoreMouseEvents={!store.mouseInActiveArea}
        ref={ref => ref && onRef(ref.window)}
        file={Constants.APP_URL}
        show={electronStore.show ? this.state.show : false}
        opacity={electronStore.show === 1 ? 0 : 1}
        frame={false}
        hasShadow={false}
        showDevTools={Electron.state.showDevTools.app}
        transparent
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        position={this.state.position}
        size={this.state.size}
        onMove={this.handleMove}
      />
    )
  }
}
