// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view, react } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App, Electron, Swift } from '@mcro/all'
import * as Mobx from 'mobx'

const log = debug('OrbitWindow')

@view.provide({
  store: class OrbitStore {
    orbitRef = null

    @react
    watchFullScreenForFocus = [
      () => Electron.orbitState.fullScreen,
      fullScreen => {
        if (!fullScreen) return
        // focus orbit window
        if (this.orbitRef) {
          this.orbitRef.focus()
        }
      },
    ]

    @react
    watchMouseForOrbitFocus = [
      () => Electron.orbitState.mouseOver || Electron.peekState.mouseOver,
      mouseOver => {
        log(`Electron.orbitState.mouseOver ${mouseOver}`)
        if (mouseOver) {
          this.orbitRef && this.orbitRef.focus()
        } else {
          Swift.defocus()
        }
      },
    ]

    handleOrbitRef = ref => {
      if (!ref) return
      if (this.orbitRef) return
      this.orbitRef = ref.window
      this.orbitRef.focus() // puts it above highlights
    }
  },
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
