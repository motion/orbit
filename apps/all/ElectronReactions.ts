import { store, react, sleep } from '@mcro/black/store'
import { App } from './App'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import orbitPosition from './helpers/orbitPosition'
import peekPosition from './helpers/peekPosition'
import debug from '@mcro/debug'

const log = debug('ElectronReactions')

const appTarget = ({ offset, bounds }) => {
  if (!offset || !bounds) return null
  const [left, top] = offset
  const [width, height] = bounds
  return { top, left, width, height }
}

const isMouseOver = (app, mousePosition) => {
  if (!app || !mousePosition) return false
  const { x, y } = mousePosition
  const { position, size } = app
  if (!position || !size) return false
  const withinX = x > position[0] && x < position[0] + size[0]
  const withinY = y > position[1] && y < position[1] + size[1]
  return withinX && withinY
}

const SCREEN_PAD = 15

@store
export default class ElectronReactions {
  repositionToAppState = null

  constructor() {
    Electron.onMessage(msg => {
      switch (msg) {
        case Electron.messages.TOGGLE_PINNED:
          this.togglePinned()
      }
    })
  }

  @react
  repositionAfterDocked = [
    () => App.state.orbitHidden,
    async (hidden, { sleep, when }) => {
      if (!hidden || !Electron.orbitState.dockedPinned) {
        throw react.cancel
      }
      await sleep(() => App.animationDuration)
      await when(() => !App.isAnimatingOrbit)
      Electron.lastAction = null
      this.repositionToAppState = Date.now()
    },
  ]

  onShortcut = async shortcut => {
    if (shortcut === 'CommandOrControl+Space') {
      if (App.state.orbitHidden) {
        Electron.lastAction = shortcut
        this.repositionToAppState = Date.now()
        await sleep(30)
        Electron.sendMessage(App, App.messages.SHOW)
      } else {
        Electron.lastAction = null
        Electron.sendMessage(App, App.messages.HIDE)
      }
      return
    }
    if (shortcut === 'Option+Space') {
      if (App.state.orbitHidden) {
        this.toggleVisible()
        Electron.lastAction = shortcut
        this.updatePinned(true)
        return
      }
      if (Electron.orbitState.pinned) {
        this.togglePinned()
        this.toggleVisible()
        return
      } else {
        // !pinned
        this.togglePinned()
      }
    }
  }

  toggleVisible = () => {
    if (App.state.orbitHidden) {
      Electron.sendMessage(App, App.messages.HIDE)
    } else {
      Electron.sendMessage(App, App.messages.SHOW)
    }
  }

  togglePinned = () => {
    this.updatePinned(!Electron.orbitState.pinned)
  }

  updatePinned = pinned => {
    Electron.setOrbitState({ pinned })
  }

  @react
  unPinOnHidden = [
    () => App.isFullyHidden,
    hidden => {
      if (!hidden || !Electron.orbitState.pinned) {
        throw react.cancel
      }
      this.updatePinned(false)
    },
  ]

  @react({ log: false })
  setMouseOvers = [
    () => [
      Desktop.mouseState.position,
      App.state.orbitHidden,
      Electron.orbitState.position,
      App.state.peekTarget,
    ],
    async ([mP, isHidden, orbitPosition, peekTarget], { sleep }) => {
      if (isHidden) {
        if (Electron.orbitState.mouseOver) {
          Electron.setState({
            peekState: { mouseOver: false },
            orbitState: { mouseOver: false },
          })
        }
        // open if hovering indicator
        const [oX, oY] = orbitPosition
        // TODO: Constants.ORBIT_WIDTH
        const adjX = Electron.orbitOnLeft ? 313 : 17
        const adjY = 36
        const withinX = Math.abs(oX - mP.x + adjX) < 6
        const withinY = Math.abs(oY - mP.y + adjY) < 15
        if (withinX && withinY) {
          await sleep(250)
          Electron.sendMessage(App, App.messages.SHOW)
        }
        return
      }
      if (Electron.orbitState.position) {
        const mouseOver = isMouseOver(Electron.orbitState, mP)
        // TODO: think we can avoid this check because we do it in Bridge
        if (mouseOver !== Electron.orbitState.mouseOver) {
          Electron.setOrbitState({ mouseOver })
        }
      }
      if (!peekTarget) {
        Electron.setPeekState({ mouseOver: false })
      } else {
        const mouseOver = isMouseOver(Electron.peekState, mP)
        if (mouseOver !== Electron.peekState.mouseOver) {
          Electron.setPeekState({ mouseOver })
        }
      }
    },
  ]

  // one source of truth
  // since electron needs to do stuff
  // it handles it here primarily

  @react
  handleHoldingOption = [
    () => Desktop.isHoldingOption,
    async (isHoldingOption, { sleep }) => {
      if (Electron.orbitState.pinned || Electron.orbitState.dockedPinned) {
        throw react.cancel
      }
      if (!isHoldingOption) {
        if (!Electron.orbitState.pinned && Electron.isMouseInActiveArea) {
          log('prevent hide while mouseover after release hold')
          throw react.cancel
        }
        Electron.sendMessage(App, App.messages.HIDE)
        throw react.cancel
      }
      await sleep(140)
      Electron.sendMessage(App, App.messages.SHOW)
      // await sleep(3500)
      // this.updatePinned(true)
    },
  ]

  @react({ fireImmediately: true })
  peekPosition = [
    () => App.state.peekTarget,
    peekTarget => {
      if (!peekTarget) {
        throw react.cancel
      }
      Electron.setPeekState({
        id: Math.random(),
        ...peekPosition(peekTarget.position, Electron),
      })
    },
  ]

  @react({ fireImmediately: true })
  repositioningFromAppState = [
    () => [
      appTarget(Desktop.appState || {}),
      Desktop.linesBoundingBox,
      this.repositionToAppState,
    ],
    ([appBB, linesBB]) => {
      // dont reposition while showing + dockedPinned
      if (!App.state.orbitHidden && Electron.orbitState.dockedPinned) {
        throw react.cancel
      }
      // prefer using lines bounding box, fall back to app
      const box = linesBB || appBB
      if (!box) {
        throw react.cancel
      }
      // pinning to side
      if (Electron.lastAction === 'CommandOrControl+Space') {
        Electron.setOrbitState({
          ...orbitPosition(box, true),
          dockedPinned: true,
        })
        return
      }
      let { position, size, orbitOnLeft, orbitDocked } = orbitPosition(box)
      if (linesBB) {
        // add padding
        position[0] += orbitOnLeft ? -SCREEN_PAD : SCREEN_PAD
      } else {
        // remove padding
        position[0] += orbitOnLeft ? SCREEN_PAD : -SCREEN_PAD
      }
      Electron.setOrbitState({
        position,
        size,
        orbitOnLeft,
        orbitDocked,
        dockedPinned: false,
      })
    },
  ]
}
