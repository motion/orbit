// @flow
import { store, react } from '@mcro/black/store'
import App from './App'
import Desktop from './Desktop'
import Electron from './Electron'

const log = debug('ElectronReactions')

const isMouseOver = (app, mousePosition) => {
  if (!app || !mousePosition) return false
  const { x, y } = mousePosition
  const { position, size } = app
  if (!position || !size) return false
  const withinX = x > position[0] && x < position[0] + size[0]
  const withinY = y > position[1] && y < position[1] + size[1]
  return withinX && withinY
}

@store
export default class ElectronReactions {
  @react
  shouldTogglePinned = [
    () => [App.state.shouldTogglePinned, Desktop.state.shouldTogglePin],
    Electron.togglePinned,
  ]

  @react
  unPinOnUnFullScreen = [
    () => [Electron.fullScreen, App.state.orbitHidden],
    ([fullScreen, hidden]) => {
      if (!fullScreen || !hidden) {
        Electron.setPinned(false)
      }
    },
    { delay: 300 },
  ]

  @react
  setMouseOvers = [
    () => [Desktop.state.mousePosition, App.state.orbitHidden],
    ([mousePosition, isHidden]) => {
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

  showAfterDelay = 0
  stickAfterDelay = 0

  @react
  handleHoldingOption = [
    () => Desktop.isHoldingOption,
    isHoldingOption => {
      console.log('got hold', isHoldingOption)
      clearTimeout(this.showAfterDelay)
      clearTimeout(this.stickAfterDelay)
      if (Electron.orbitState.pinned) {
        log(`pinned, avoid`)
        return
      }
      if (!isHoldingOption) {
        // TODO
        if (!Electron.orbitState.pinned && Electron.isMouseInActiveArea) {
          log('prevent hide while mouseover after release hold')
          return
        }
        Electron.setState({ shouldHide: Date.now() })
        return
      }
      if (App.state.orbitHidden) {
        // SHOW
        this.showAfterDelay = setTimeout(() => {
          Electron.setState({ shouldShow: Date.now() })
        }, 150)
        this.stickAfterDelay = setTimeout(() => {
          log(`held open for 3 seconds, sticking...`)
          Electron.setPinned(true)
        }, 4000)
      }
    },
    { delay: 16 },
  ]

  // option tap to clear if open
  // let lastDown = 0
  // this.react(
  //   () => Desktop.isHoldingOption,
  //   holding => {
  //     const justTapped = !holding && Date.now() - lastDown < 100
  //     if (justTapped) {
  //       Electron.setState({ shouldHide: Date.now() })
  //     }
  //     if (holding) {
  //       lastDown = Date.now()
  //     }
  //   },
  // )
}
