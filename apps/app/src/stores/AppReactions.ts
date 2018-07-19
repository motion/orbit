import { store, react, sleep } from '@mcro/black/store'
import { App, Desktop } from '@mcro/stores'
import orbitPosition from '../helpers/orbitPosition'
// import debug from '@mcro/debug'
// const log = debug('AppReactions')

const SCREEN_PAD = 15
const appTarget = ({ offset, bounds }) => {
  if (!offset || !bounds) return null
  const [left, top] = offset
  const [width, height] = bounds
  return { top, left, width, height }
}

@store
export class AppReactions {
  onPinKey = null
  id = Math.random()

  constructor({ onPinKey }) {
    this.onPinKey = onPinKey
    this.setupReactions()
  }

  async setupReactions() {
    if (typeof App.onMessage !== 'function') {
      console.log('weird app on hmr', App, App.onMessage)
      await sleep(100)
    }
    console.log('mounting...', this.id)
    const dispose = App.onMessage(async msg => {
      switch (msg) {
        case App.messages.TOGGLE_SHOWN:
          this.toggle()
          return
        case App.messages.TOGGLE_DOCKED:
          console.log('toggle docked', this.id, this)
          App.setOrbitState({ docked: !App.orbitState.docked })
          return
        case App.messages.HIDE:
          this.hide()
          return
        case App.messages.SHOW:
          this.show()
          return
        case App.messages.HIDE_PEEK:
          return App.actions.clearPeek()
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
        this.onPinKey(key.toLowerCase())
      }
    })
    this.subscriptions.add({
      dispose,
    })
  }

  // disable sidebar  for now

  // toggle() {
  //   if (App.orbitState.hidden) {
  //     this.show()
  //   } else {
  //     this.hide()
  //   }
  // }

  // show() {
  //   App.setOrbitState({ hidden: false })
  // }

  hide = async () => {
    // hide peek first
    if (App.peekState.target && !App.peekState.pinned) {
      App.actions.clearPeek()
      await new Promise(res => setTimeout(res, 80)) // sleep 80
      return
    }
    // hide orbit docked second
    if (App.orbitState.docked) {
      App.setOrbitState({ docked: false })
      return
    }
    App.setOrbitState({ hidden: true })
  }

  // handleHoldingOption = react(
  //   () => Desktop.isHoldingOption,
  //   async (isHoldingOption, { sleep }) => {
  //     if (App.orbitState.pinned || App.orbitState.docked) {
  //       throw react.cancel
  //     }
  //     if (!isHoldingOption) {
  //       if (!App.orbitState.pinned && App.isMouseInActiveArea) {
  //         log('prevent hide while mouseover after release hold')
  //         throw react.cancel
  //       }
  //       App.setOrbitState({ hidden: true })
  //       throw react.cancel
  //     }
  //     await sleep(140)
  //     App.setOrbitState({ hidden: false })
  //     // await sleep(3500)
  //     // this.updatePinned(true)
  //   },
  //   { log: 'state' },
  // )

  clearPeekOnOrbitClose = react(
    () => App.isFullyHidden,
    hidden => {
      if (!hidden) {
        throw react.cancel
      }
      // dont close peek when pinned
      if (App.peekState.pinned) {
        throw react.cancel
      }
      App.actions.clearPeek()
    },
    { log: 'state' },
  )

  // onPinned = react(
  //   () => App.orbitState.pinned,
  //   pinned => {
  //     if (pinned) {
  //       App.setOrbitState({ hidden: false })
  //     } else {
  //       App.setOrbitState({ hidden: true })
  //     }
  //   },
  //   { log: 'state' },
  // )

  unPinOnHidden = react(
    () => App.isFullyHidden,
    hidden => {
      if (!hidden) {
        throw react.cancel
      }
      App.setOrbitState({ pinned: false })
    },
    { log: 'state' },
  )

  // TODO: re-enable these

  // clearPeekOnReposition = react(
  //   () => App.orbitState.position,
  //   App.actions.clearPeek,
  // )

  // react
  // clearPeekOnMouseOut = [
  //   () => Desktop.hoverState.peekHovered,
  //   async (mouseOver, { sleep }) => {
  //     if (mouseOver || Desktop.hoverState.orbitHovered) {
  //       return
  //     }
  //     // wait a bit
  //     await sleep(400)
  //     App.clearPeek()
  //   },
  // ]

  // hide orbit on unfocus
  // focusedOnOrbit = react(
  //   () => Desktop.state.focusedOnOrbit,
  //   willBeFocusedOnOrbit => {
  //     if (this.focusedOnOrbit && !willBeFocusedOnOrbit) {
  //       App.setOrbitState({ orbitDocked: false })
  //     }
  //   }
  // )

  showOrbitOnHoverWord = react(
    () => App.hoveredWordName,
    async (word, { sleep }) => {
      if (Desktop.isHoldingOption) {
        throw react.cancel
      }
      const hidden = !word
      await sleep(hidden ? 50 : 500)
      App.setOrbitState({ hidden })
    },
  )

  hideOrbitOnMouseOut = react(
    () => [
      Desktop.hoverState.orbitHovered || Desktop.hoverState.peekHovered,
      App.peekState.target,
    ],
    async ([mouseOver], { sleep }) => {
      const isShown = !App.orbitState.hidden
      if (!isShown || mouseOver || App.orbitState.pinned) {
        throw react.cancel
      }
      // some leeway on mouse leave
      await sleep(150)
      if (Desktop.isHoldingOption || App.isAnimatingOrbit) {
        throw react.cancel
      }
      console.log('hiding orbit from mouseout')
      App.setOrbitState({ hidden: true })
    },
    {
      delay: 32,
      log: 'state',
    },
  )

  repositioningFromAppState = react(
    () => [appTarget(Desktop.appState || {}), Desktop.linesBoundingBox],
    ([appBB, linesBB]) => {
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
    { immediate: true },
  )
}
