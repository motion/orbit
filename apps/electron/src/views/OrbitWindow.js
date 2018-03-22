import * as React from 'react'
import * as Constants from '~/constants'
import { view, react } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App, Electron, Swift } from '@mcro/all'
import * as Mobx from 'mobx'

const log = debug('OrbitWindow')

class OrbitWindowStore {
  show = false
  orbitRef = null

  // sitrep
  focusOrbit = () => {
    log('focusOrbit')
    try {
      if (this.orbitRef) {
        this.orbitRef.focus()
      }
    } catch (err) {
      console.error('error on focus', err)
    }
  }

  @react
  setHasPositionedFullScreen = [
    () => Electron.orbitState.fullScreen,
    async (fs, { sleep }) => {
      if (!fs) return
      await sleep(16)
      Electron.setOrbitState({ hasPositionedFullScreen: true })
    },
  ]

  @react({ delay: 100, log: false })
  delayedOrbitState = () => Mobx.toJS(Electron.orbitState)

  @react
  watchFullScreenForFocus = [
    () => Electron.orbitState.fullScreen,
    fullScreen => {
      if (fullScreen) {
        this.focusOrbit()
      } else {
        Swift.defocus()
      }
    },
  ]

  @react({ delay: App.animationDuration })
  defocusOnUnPin = [
    () => !Electron.orbitState.pinned,
    val => val && Swift.defocus(),
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
  render({ store }) {
    if (!store.delayedOrbitState) {
      return null
    }
    const state = Mobx.toJS(store.delayedOrbitState)
    return (
      <Window
        frame={false}
        hasShadow={false}
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        transparent={true}
        showDevTools={Electron.state.showDevTools.orbit}
        alwaysOnTop
        show={store.show}
        ignoreMouseEvents={!App.isShowingOrbit}
        size={state.size}
        position={state.position}
        file={`${Constants.APP_URL}/orbit`}
        ref={store.handleOrbitRef}
        onReadyToShow={store.ref('show').setter(true)}
      />
    )
  }
}
