// @flow
import { store, react } from '@mcro/black/store'
import App from './App'
import Desktop from './Desktop'
import Electron from './Electron'
import orbitPosition from './helpers/orbitPosition'
import screenSize from './helpers/screenSize'

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
  // values
  screenSize = screenSize
  afterUnFullScreen = false

  // side effects

  @react({ delay: 500, delayValue: true })
  wasFullScreen = [() => Electron.orbitState.fullScreen, _ => _]

  @react
  repositionAfterFullScreen = [
    () => [App.state.orbitHidden, this.wasFullScreen],
    ([hidden, wasFullScreen]) => {
      if (wasFullScreen && hidden) {
        log(`SHOULD reposition after fullscreen!`)
        // this.afterUnFullScreen = Date.now()
      }
    },
  ]

  @react
  shouldTogglePinned = [
    () => [App.state.shouldTogglePinned, Desktop.state.shouldTogglePin],
    Electron.togglePinned,
  ]

  @react
  unPinOnSwitchApp = [
    () => Desktop.state.appState.id,
    () => Electron.setPinned(false),
  ]

  @react
  unPinOnUnFullScreen = [
    () => Electron.orbitState.fullScreen,
    () => Electron.setPinned(false),
  ]

  @react
  unPinOnHidden = [
    () => App.isFullyHidden,
    hidden => hidden && Electron.orbitState.pinned && Electron.setPinned(false),
  ]

  @react
  hideFullScreenOnDefocus = [
    () => Desktop.state.appState,
    () => {
      if (Electron.orbitState.fullScreen) {
        Electron.shouldHide()
      }
    },
  ]

  @react
  hideFullScreenOnEsc = [
    () => Desktop.state.keyboard.esc,
    () => {
      if (Electron.orbitState.fullScreen) {
        Electron.shouldHide()
      }
    },
  ]

  @react
  setMouseOvers = [
    () => [Desktop.state.mousePosition, App.state.orbitHidden],
    ([mousePosition, isHidden], { preventLogging }) => {
      preventLogging()
      if (Electron.orbitState.pinned) {
        return
      }
      if (isHidden) {
        if (Electron.orbitState.mouseOver) {
          Electron.setOrbitState({ mouseOver: false })
          Electron.setPeekState({ mouseOver: false })
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
        // TODO
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
        await sleep(3500)
        Electron.setPinned(true)
      }
    },
  ]

  @react({ fireImmediately: true })
  positionOrbitFromBoundingBox = [
    () => [
      appTarget(Desktop.state.appState || {}),
      Desktop.linesBoundingBox,
      this.afterUnFullScreen,
    ],
    async ([appBB, linesBB], { sleep }) => {
      // so app can hide before we transition
      log(`position from bounding`)
      await sleep(32)
      // prefer using lines bounding box, fall back to app
      const box = linesBB || appBB
      if (!box) return
      let { position, size, arrowTowards } = orbitPosition(box)
      if (linesBB) {
        // add padding
        position[0] += arrowTowards === 'left' ? SCREEN_PAD : -SCREEN_PAD
      } else {
        // remove padding
        position[0] += arrowTowards === 'right' ? SCREEN_PAD : -SCREEN_PAD
      }
      Electron.setOrbitState({
        position,
        size,
        arrowTowards,
        fullScreen: false,
      })
    },
  ]
}
