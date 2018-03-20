// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view, react } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App, Electron, Swift } from '@mcro/all'
import * as Mobx from 'mobx'

const log = debug('OrbitWindow')

class OrbitWindowStore {
  orbitRef = null

  get peekWindow() {
    return this.props.electronStore.peekRefs[0]
  }

  focusOrbit = () => {
    if (this.orbitRef) {
      this.orbitRef.focus()
    }
    // then focus peek next so its above
    if (this.peekWindow) {
      this.peekWindow.focus()
    }
  }

  @react
  watchFullScreenForFocus = [
    () => Electron.orbitState.fullScreen,
    fullScreen => {
      if (!fullScreen) return
      this.focusOrbit()
    },
  ]

  @react
  watchMouseForOrbitFocus = [
    () => Electron.orbitState.mouseOver || Electron.peekState.mouseOver,
    mouseOver => {
      if (Electron.orbitState.pinned || Electron.orbitState.fullScreen) {
        return
      }
      if (mouseOver) {
        this.focusOrbit()
      } else {
        Swift.defocus()
      }
    },
  ]

  handleOrbitRef = ref => {
    if (!ref) return
    if (this.orbitRef) return
    this.orbitRef = ref.window
    this.focusOrbit()
  }
}

@view.attach('electronStore')
@view.provide({
  store: OrbitWindowStore,
})
@view.electron
export default class OrbitWindow extends React.Component {
  state = {
    show: false,
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  render({ store }) {
    const state = Mobx.toJS(Electron.orbitState)
    return (
      <Window
        frame={false}
        hasShadow={false}
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        transparent={true}
        showDevTools={Electron.state.showDevTools.orbit}
        alwaysOnTop
        show={this.state.show}
        ignoreMouseEvents={!App.isShowingOrbit}
        size={state.size}
        position={state.position}
        file={`${Constants.APP_URL}/orbit`}
        ref={store.handleOrbitRef}
        onReadyToShow={() => this.setState({ show: true })}
      />
    )
  }
}
