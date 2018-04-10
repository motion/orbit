import * as React from 'react'
import * as Constants from '~/constants'
import { view, react, isEqual } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App, Electron, Desktop, Swift } from '@mcro/all'
import * as Mobx from 'mobx'

const log = debug('OrbitWindow')

class OrbitWindowStore {
  show = 0
  orbitRef = null
  clear = 0

  willMount() {
    Electron.onMessage(msg => {
      if (msg === 'CLEAR') {
        this.clear = Date.now()
      }
    })
  }

  @react({ log: false })
  clearOrbitPosition = [
    () => this.clear,
    async (_, { when, sleep }) => {
      if (!this.orbitRef) return
      log(`hiding`)
      this.orbitRef.hide()
      const lastState = Mobx.toJS(Desktop.appState)
      this.show = 0
      await when(() => !isEqual(Desktop.appState, lastState))
      this.show = 1
      await sleep(250) // render opacity 0, let it update
      await when(() => !Desktop.state.mouseDown)
      this.show = 2
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
      if (mouseOver && Electron.orbitState.fullScreen) {
        this.focusOrbit()
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
    this.show = 2
  }
}

@view.attach('electronStore')
@view.provide({
  store: OrbitWindowStore,
})
@view.electron
export default class OrbitWindow extends React.Component {
  render({ store }) {
    const state = Mobx.toJS(Electron.orbitState)
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
        show={store.show ? true : false}
        opacity={store.show === 1 ? 0 : 1}
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
