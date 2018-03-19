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
      if (!shouldShow) return
      const orbitHidden = shouldHide > shouldShow
      App.setOrbitHidden(orbitHidden)
    },
    true,
  ]

  @react
  clearPeekOnMouseOut = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      if (!mouseOver && !App.state.peekTarget) {
        App.setPeekTarget(null)
      }
    },
    {
      delay: 500,
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
  showOrbitOnPin = [
    () => Electron.orbitState.pinned,
    pinned => {
      if (Electron.recentlyToggled) {
        return
      }
      App.setOrbitHidden(!pinned)
    },
  ]

  @react
  hideOrbitOnMouseOut = [
    () => [
      !App.state.orbitHidden || Electron.orbitState.pinned,
      Electron.orbitState.mouseOver || Electron.peekState.mouseOver,
    ],
    async ([isShown, mouseOver], { sleep }) => {
      if (Desktop.isHoldingOption || Electron.recentlyToggled) {
        return
      }
      if (isShown && !mouseOver) {
        await sleep(100)
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
