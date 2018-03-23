// @flow
import { store, react } from '@mcro/black/store'
import Desktop from './Desktop'
import Electron from './Electron'
import App from './App'

@store
export default class AppReactions {
  @react
  showHideApp = [() => App.state.openResult, () => App.setOrbitHidden(true)]

  @react({
    fireImmediately: true,
  })
  shouldShowHideFromElectron = [
    () => [Electron.state.shouldShow, Electron.state.shouldHide],
    ([shouldShow, shouldHide]) => {
      const orbitHidden = shouldHide > shouldShow
      App.setOrbitHidden(orbitHidden)
    },
  ]

  @react
  shouldShowHideFromElectronState = [
    () => [Electron.orbitState.fullScreen, Electron.orbitState.pinned],
    ([fullScreen, pinned]) => {
      if (fullScreen || pinned) {
        App.setOrbitHidden(false)
      }
    },
  ]

  @react({ log: false })
  showOnMouseOverOrbitBar = [
    () => [Desktop.state.mousePosition, Electron.orbitState],
    async ([{ x, y }, orbitState], { sleep }) => {
      if (!orbitState.position) {
        return
      }
      if (Electron.orbitState.fullScreen) {
        return
      }
      const { position: [oX, oY] } = orbitState
      // TODO: Constants.ORBIT_WIDTH
      const adjX = Electron.orbitOnLeft ? 300 : 0
      const adjY = 44 // topbar + offset from top of orbit
      const withinX = Math.abs(oX - x + adjX) < 10
      const withinY = Math.abs(oY - y + adjY) < 10
      if (withinX && withinY) {
        await sleep(300)
        App.setOrbitHidden(false)
      }
    },
  ]

  @react({
    delay: 300,
  })
  clearPeekOnMouseOut = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      if (!mouseOver) {
        App.setPeekTarget(null)
      }
    },
  ]

  @react
  clearPeekTarget = [
    () => Electron.orbitState.fullScreen,
    fullScreen => {
      if (!fullScreen) {
        App.setPeekTarget(null)
      }
    },
  ]

  @react
  hideOrbitOnEsc = [
    () => Desktop.state.keyboard.esc,
    () => {
      if (Desktop.focusedOnOrbit) {
        App.setOrbitHidden(true)
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
        if (Desktop.isHoldingOption || Electron.recentlyToggled) {
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
