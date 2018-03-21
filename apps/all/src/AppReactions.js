// @flow
import { store, react } from '@mcro/black/store'
import Desktop from './Desktop'
import Electron from './Electron'
import App from './App'

@store
export default class AppReactions {
  @react
  showHideApp = [() => App.state.openResult, () => App.setOrbitHidden(true)]

  @react
  shouldShowHideFromElectron = [
    () => [Electron.state.shouldShow, Electron.state.shouldHide],
    ([shouldShow, shouldHide]) => {
      const orbitHidden = shouldHide > shouldShow
      App.setOrbitHidden(orbitHidden)
    },
    true,
  ]

  @react
  shouldShowHideFromElectronState = [
    () => [Electron.orbitState.fullScreen, Electron.orbitState.pinned],
    ([fullScreen, pinned]) => {
      if (fullScreen || pinned) {
        App.setOrbitHidden(false)
      } else {
        App.setOrbitHidden(true)
      }
    },
  ]

  @react
  showOnMouseOverOrbitBar = [
    () => [Desktop.state.mousePosition, Electron.orbitState],
    async ([{ x, y }, orbitState], { sleep, preventLogging }) => {
      preventLogging()
      if (!orbitState.position) return
      const { position: [oX, oY], arrowTowards } = orbitState
      // TODO: Constants.ORBIT_WIDTH
      const adjX = arrowTowards === 'right' ? 300 : 0
      const adjY = 44 // topbar + offset from top of orbit
      const withinX = Math.abs(oX - x + adjX) < 10
      const withinY = Math.abs(oY - y + adjY) < 10
      if (withinX && withinY) {
        await sleep(300)
        App.setOrbitHidden(false)
      }
    },
  ]

  @react
  clearPeekOnMouseOut = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      if (!mouseOver) {
        // && !App.state.peekTarget
        App.setPeekTarget(null)
      }
    },
    {
      delay: 300,
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
      if (!App.state.orbitHidden) {
        App.setOrbitHidden(true)
      }
    },
  ]

  @react
  hideOrbitOnMouseOut = [
    () => [
      !App.state.orbitHidden,
      Electron.orbitState.mouseOver || Electron.peekState.mouseOver,
    ],
    async ([isShown, mouseOver], { sleep }) => {
      if (Desktop.isHoldingOption || Electron.recentlyToggled) {
        return
      }
      if (isShown && !mouseOver) {
        await sleep(100)
        if (Electron.orbitState.pinned || Electron.orbitState.fullScreen) {
          return
        }
        App.setOrbitHidden(true)
      }
    },
    {
      delay: 32,
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
