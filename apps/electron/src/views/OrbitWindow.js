import * as React from 'react'
import * as Constants from '~/constants'
import { view, react } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App, Electron, Swift } from '@mcro/all'
import * as Mobx from 'mobx'

const log = debug('OrbitWindow')

class OrbitWindowStore {
  show = 0
  orbitRef = null

  @react
  unFullScreenOnHide = [
    () => App.isShowingOrbit,
    showing => {
      if (showing) {
        return
      }
      if (Electron.orbitState.fullScreen) {
        log(`clearing`)
        this.clear = Date.now()
      }
    },
  ]

  // sitrep
  focusOrbit = () => {
    try {
      if (this.orbitRef) {
        this.orbitRef.focus()
      }
    } catch (err) {
      console.error('error on focus', err)
    }
  }

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
  defocusAfterClosing = [
    () =>
      Electron.orbitState.pinned ||
      (App.isShowingOrbit && Electron.orbitState.mouseOver),
    showing => {
      if (showing || Electron.orbitState.fullScreen) {
        return
      }
      Swift.defocus()
    },
  ]

  @react({ delay: App.animationDuration })
  defocusAfterClosing = [
    () => [Electron.orbitState.pinned, App.isShowingOrbit],
    ([pinned, showing]) => {
      if (pinned || showing || Electron.orbitState.mouseOver) {
        return
      }
      Swift.defocus()
    },
  ]

  @react
  focusOnMouseOver = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      if (!App.isShowingOrbit) {
        return
      }
      if (mouseOver && Electron.orbitState.fullScreen) {
        this.focusOrbit()
        return
      }
      if (Electron.orbitState.pinned) {
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

  handleReadyToShow = () => {
    this.show = true
  }
}

@view.attach('electronStore')
@view.provide({
  store: OrbitWindowStore,
})
@view.electron
export default class OrbitWindow extends React.Component {
  render({ electronStore, store }) {
    const state = Mobx.toJS(Electron.orbitState)
    const show = electronStore.show >= 1 ? true : false
    const opacity = electronStore.show <= 1 ? 0 : 1
    return (
      <Window
        frame={false}
        hasShadow={false}
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        blinkFeatures="CSSOverscrollBehavior CSSOMSmoothScroll"
        transparent={true}
        showDevTools={Electron.state.showDevTools.orbit}
        alwaysOnTop
        show={show}
        opacity={opacity}
        ignoreMouseEvents={!App.isShowingOrbit}
        size={state.size}
        position={state.position}
        file={`${Constants.APP_URL}/orbit`}
        ref={store.handleOrbitRef}
        onReadyToShow={store.handleReadyToShow}
        devToolsExtensions={Constants.DEV_TOOLS_EXTENSIONS}
      />
    )
  }
}
