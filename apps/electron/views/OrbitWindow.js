import * as React from 'react'
import * as Constants from '~/constants'
import { view, react } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App, Electron, Desktop, Swift } from '@mcro/all'
import * as Mobx from 'mobx'
import { globalShortcut } from 'electron'

const log = debug('OrbitWindow')

class OrbitWindowStore {
  show = 0
  orbitRef = null

  @react
  unFullScreenOnHide = [
    () => App.isShowingOrbit,
    showing => {
      if (showing) {
        throw react.cancel
      }
      if (Electron.orbitState.fullScreen) {
        log(`clearing`)
        this.clear = Date.now()
      }
    },
  ]

  keyShortcuts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map(key => ({ key, shortcut: `Option+${key}` }))

  @react
  easyPinWithLetter = [
    () => Desktop.isHoldingOption && App.isShowingOrbit,
    async (down, { when }) => {
      await when(() => !App.isAnimatingOrbit)
      if (down) {
        for (const { key, shortcut } of this.keyShortcuts) {
          globalShortcut.register(shortcut, async () => {
            // PIN
            if (!Electron.orbitState.pinned) {
              Electron.setOrbitState({ pinned: true })
            }
            // TYPE THE KEY
            Electron.sendMessage(App, `${App.messages.PIN}-${key}`)
            // FOCUS
            this.focusOrbit()
            // then register shortcuts
            await when(() => !Desktop.isHoldingOption)
            this.unRegisterKeyShortcuts()
          })
        }
      } else {
        await when(() => !Desktop.isHoldingOption)
        this.unRegisterKeyShortcuts()
      }
    },
  ]

  unRegisterKeyShortcuts = () => {
    for (const { shortcut } of this.keyShortcuts) {
      globalShortcut.unregister(shortcut)
    }
  }

  focusOrbit = () => {
    if (!this.orbitRef) return
    if (Electron.orbitState.fullScreen) return
    this.orbitRef.focus()
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

  @react
  focusOnPinned = [
    () => Electron.orbitState.dockedPinned || Electron.orbitState.pinned,
    async (pinned, { sleep, when }) => {
      if (!pinned) {
        Swift.defocus()
        return
      }
      await sleep(App.animationDuration)
      await when(() => !App.isAnimatingOrbit)
      this.focusOrbit()
    },
  ]

  @react({ delay: App.animationDuration, log: 'state' })
  defocusAfterClosing = [
    () => [Electron.orbitState.pinned, App.isShowingOrbit],
    ([pinned, showing]) => {
      if (pinned || showing || Electron.orbitState.mouseOver) {
        throw react.cancel
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
      if (Electron.orbitState.fullScreen) {
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
    this.props.onRef(this.orbitRef)
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
