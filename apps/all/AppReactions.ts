import { store, react } from '@mcro/black/store'
// import * as Constants from '@mcro/constants'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import { App } from './App'

// todo: move this reaction stuff into specialized sub-stores of appstore
// prevents hard restarts
// and groups by logical unit (piece of state)

@store
export default class AppReactions {
  constructor({ onPinKey }) {
    App.onMessage(msg => {
      console.log('got a message', msg)
      switch (msg) {
        case App.messages.HIDE:
          return App.setOrbitHidden(true)
        case App.messages.SHOW:
          return App.setOrbitHidden(false)
      }
      if (msg.indexOf(App.messages.PIN) === 0) {
        const key = msg.split('-')[1]
        onPinKey(key.toLowerCase())
      }
    })
  }

  @react
  showHideApp = [() => App.state.openResult, () => App.setOrbitHidden(true)]

  @react
  clearPeekTargetOnOrbitClose = [
    () => !App.isShowingOrbit,
    hidden => hidden && App.setPeekTarget(null),
  ]

  @react
  onFullScreen = [
    () => Electron.orbitState.fullScreen,
    full => {
      if (full) {
        App.setOrbitHidden(false)
      } else {
        App.setPeekTarget(null)
      }
    },
  ]

  @react
  onPinned = [
    () => Electron.orbitState.pinned,
    pinned => {
      if (pinned) {
        App.setOrbitHidden(false)
      } else {
        App.setOrbitHidden(true)
      }
    },
  ]

  @react
  clearPinnedOnReposition = [
    () => Electron.orbitState.position,
    () => {
      if (App.state.peekTarget) {
        App.setPeekTarget(null)
      }
    },
  ]

  @react({
    delay: 32,
  })
  hideOrbitOnMouseOut = [
    () => [
      !App.state.orbitHidden,
      Electron.orbitState.mouseOver || Electron.peekState.mouseOver,
    ],
    async ([isShown, mouseOver], { sleep }) => {
      if (isShown && !mouseOver) {
        // 100ms leeway on mouse leave
        await sleep(100)
        if (Desktop.isHoldingOption || App.isAnimatingOrbit) {
          return
        }
        if (Electron.orbitState.pinned || Electron.orbitState.fullScreen) {
          return
        }
        App.setOrbitHidden(true)
      }
    },
  ]

  @react
  showOrbitOnHoverWord = [
    () => App.hoveredWordName,
    async (word, { sleep }) => {
      if (Desktop.isHoldingOption) {
        return
      }
      const orbitHidden = !word
      await sleep(orbitHidden ? 50 : 500)
      App.setOrbitHidden(orbitHidden)
    },
  ]
}
