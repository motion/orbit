import { store, react } from '@mcro/black/store'
import { App } from './App'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import orbitPosition from './helpers/orbitPosition'
import screenSize from './helpers/screenSize'
import debug from '@mcro/debug'
import * as Constants from '@mcro/constants'

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
  screenSize = screenSize
  goingToReposition = null

  willReposition = () => {
    Electron.setState({ willReposition: Date.now() })
    // this.goingToReposition = Date.now()
  }

  @react
  unFullScreenOnHide = [
    () => Electron.state.shouldHide,
    () => {
      if (!Electron.orbitState.fullScreen || App.state.orbitHidden) {
        return
      }
      this.willReposition()
    },
  ]

  @react
  fullScreenOnOptionShift = [
    () => Desktop.isHoldingOptionShift,
    async (x, { sleep }) => {
      if (x) {
        await sleep(250)
        Electron.toggleFullScreen()
      } else {
        //
      }
    },
  ]

  @react
  shouldTogglePinned = [
    () => [App.state.shouldTogglePinned, Desktop.state.shouldTogglePin],
    () => {
      Electron.lastAction = 'DoubleTap'
      Electron.togglePinned()
    },
  ]

  // @react
  // unPinOnSwitchApp = [
  //   () => Desktop.appState.id,
  //   () => Electron.orbitState.pinned && Electron.setPinned(false),
  // ]

  @react
  unPinOnFullScreen = [
    () => Electron.orbitState.fullScreen,
    () => Electron.orbitState.pinned && Electron.setPinned(false),
  ]

  @react
  unPinOnHidden = [
    () => App.isFullyHidden,
    hidden => hidden && Electron.orbitState.pinned && Electron.setPinned(false),
  ]

  @react({ log: false })
  setMouseOvers = [
    () => [Desktop.mouseState.position, App.state.orbitHidden],
    ([mousePosition, isHidden]) => {
      if (isHidden) {
        if (Electron.orbitState.mouseOver) {
          Electron.setState({
            peekState: { mouseOver: false },
            orbitState: { mouseOver: false },
          })
        }
        return
      }
      if (Electron.orbitState.position) {
        const mouseOver = isMouseOver(Electron.orbitState, mousePosition)
        if (mouseOver !== Electron.orbitState.mouseOver) {
          Electron.setOrbitState({ mouseOver })
        }
      }
      if (App.state.peekTarget) {
        const mouseOver = isMouseOver(Electron.currentPeek, mousePosition)
        if (mouseOver !== Electron.peekState.mouseOver) {
          Electron.setPeekState({ mouseOver })
        }
      }
    },
  ]

  @react({ delay: 16 })
  handleHoldingOption = [
    () => Desktop.isHoldingOption,
    async (isHoldingOption, { sleep }) => {
      if (Electron.orbitState.pinned) {
        return
      }
      if (!isHoldingOption) {
        if (!Electron.orbitState.pinned && Electron.isMouseInActiveArea) {
          log('prevent hide while mouseover after release hold')
          return
        }
        if (!App.state.orbitHidden) {
          Electron.shouldHide()
        }
        return
      }
      if (App.state.orbitHidden) {
        await sleep(150)
        Electron.shouldShow()
        // await sleep(3500)
        // Electron.setPinned(true)
      }
    },
  ]

  @react({ fireImmediately: true })
  repositioningFromAppState = [
    () => [
      appTarget(Desktop.appState || {}),
      Desktop.linesBoundingBox,
      // this.goingToReposition,
    ],
    async ([appBB, linesBB], { sleep }) => {
      if (Constants.FORCE_FULLSCREEN) {
        return
      }
      // await sleep(64)
      // prefer using lines bounding box, fall back to app
      const box = linesBB || appBB
      if (!box) return
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
        fullScreen: false,
      })
    },
  ]
}
