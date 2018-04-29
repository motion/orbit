import { store, react } from '@mcro/black/store'
// import * as Constants from '@mcro/constants'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import { App } from './App'
import orbitPosition from './helpers/orbitPosition'

// todo: move this reaction stuff into specialized sub-stores of appstore
// prevents hard restarts
// and groups by logical unit (piece of state)

const SCREEN_PAD = 15
const appTarget = ({ offset, bounds }) => {
  if (!offset || !bounds) return null
  const [left, top] = offset
  const [width, height] = bounds
  return { top, left, width, height }
}

@store
export default class AppReactions {
  constructor({ onPinKey }) {
    App.onMessage(async msg => {
      switch (msg) {
        case App.messages.TOGGLE_SHOWN:
          this.toggle()
          return
        case App.messages.SHOW_DOCKED:
          App.setDockState({ pinned: true })
          return
        case App.messages.SHOW_DOCKED:
          App.setDockState({ pinned: false })
          return
        case App.messages.HIDE:
          this.hide()
          return
        case App.messages.SHOW:
          this.show()
          return
        case App.messages.HIDE_PEEK:
          return App.setPeekTarget(null)
        case App.messages.PIN:
          App.setOrbitState({ pinned: true })
          return
        case App.messages.UNPIN:
          App.setOrbitState({ pinned: false })
          return
        case App.messages.TOGGLE_PINNED:
          App.setOrbitState({ pinned: !App.orbitState.pinned })
          return
      }
      if (msg.indexOf(App.messages.PIN) === 0) {
        const key = msg.split('-')[1]
        App.setOrbitState({ pinned: true })
        onPinKey(key.toLowerCase())
      }
    })
  }

  toggle() {
    if (App.state.orbitHidden) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    App.setOrbitHidden(false)
  }

  async hide() {
    if (App.state.peekTarget) {
      App.setPeekTarget(null)
      await new Promise(res => setTimeout(res, 80)) // sleep 80
    }
    App.setOrbitHidden(true)
  }

  @react({ log: 'state' })
  clearPeekTargetOnOrbitClose = [
    () => !App.isShowingOrbit,
    hidden => {
      if (!hidden) {
        throw react.cancel
      }
      App.setPeekTarget(null)
    },
  ]

  @react({ log: 'state' })
  onPinned = [
    () => App.orbitState.pinned,
    pinned => {
      if (pinned) {
        App.setOrbitHidden(false)
      } else {
        App.setOrbitHidden(true)
      }
    },
  ]

  @react({ log: 'state' })
  clearPeekOnReposition = [
    () => App.orbitState.position,
    () => App.setPeekTarget(null),
  ]

  // disabled during testing, reenable
  // @react
  // clearPeekOnMouseOut = [
  //   () => Electron.peekState.mouseOver,
  //   async (mouseOver, { sleep }) => {
  //     if (mouseOver || App.orbitState.mouseOver) {
  //       return
  //     }
  //     // wait a bit
  //     await sleep(400)
  //     App.setPeekTarget(null)
  //   },
  // ]

  @react({
    delay: 32,
  })
  hideOrbitOnMouseOut = [
    () => [
      !App.state.orbitHidden,
      Desktop.mouseState.orbitHovered || Desktop.mouseState.peekHovered,
      // react to peek closing to see if app should too
      App.state.peekTarget,
    ],
    async ([isShown, mouseOver, peekTarget], { sleep }) => {
      if (!isShown) {
        throw react.cancel
      }
      if (mouseOver) {
        throw react.cancel
      }
      // some leeway on mouse leave
      await sleep(150)
      if (Desktop.isHoldingOption || App.isAnimatingOrbit) {
        throw react.cancel
      }
      if (App.orbitState.pinned || App.orbitState.fullScreen) {
        throw react.cancel
      }
      if (App.dockedState.pinned) {
        throw react.cancel
      }
      console.log(`hiding orbit from mouseout`)
      App.setOrbitHidden(true)
    },
  ]

  @react
  showOrbitOnHoverWord = [
    () => App.hoveredWordName,
    async (word, { sleep }) => {
      if (Desktop.isHoldingOption) {
        throw react.cancel
      }
      const orbitHidden = !word
      await sleep(orbitHidden ? 50 : 500)
      App.setOrbitHidden(orbitHidden)
    },
  ]

  @react({ fireImmediately: true })
  repositioningFromAppState = [
    () => [appTarget(Desktop.appState || {}), Desktop.linesBoundingBox],
    ([appBB, linesBB]) => {
      if (App.dockState.pinned) {
        throw react.cancel
      }
      // prefer using lines bounding box, fall back to app
      const box = linesBB || appBB
      if (!box) {
        throw react.cancel
      }
      let { position, size, orbitOnLeft, orbitDocked } = orbitPosition(box)
      if (linesBB) {
        // add padding
        position[0] += orbitOnLeft ? -SCREEN_PAD : SCREEN_PAD
      } else {
        // remove padding
        position[0] += orbitOnLeft ? SCREEN_PAD : -SCREEN_PAD
      }
      App.setOrbitState({
        position,
        size,
        orbitOnLeft,
        orbitDocked,
      })
    },
  ]
}
