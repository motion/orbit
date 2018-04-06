import { store, react } from '@mcro/black/store'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import { App } from './App'

@store
export default class AppReactions {
  @react
  showHideApp = [() => App.state.openResult, () => App.setOrbitHidden(true)]

  @react({
    fireImmediately: true,
  })
  showHideFromElectron = [
    () => [Electron.state.shouldShow, Electron.state.shouldHide],
    ([shouldShow, shouldHide]) => {
      const orbitHidden = shouldHide > shouldShow
      App.setOrbitHidden(orbitHidden)
    },
  ]

  @react.if
  clearPeekTargetOnMouseLeave = [
    () => !Electron.isMouseInActiveArea,
    () => App.setPeekTarget(null),
  ]

  @react.if
  clearPeekTargetOnOrbitClose = [
    () => !App.isShowingOrbit,
    () => App.setPeekTarget(null),
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

  @react({ log: false })
  showOnMouseOverOrbitBar = [
    () => [Desktop.mouseState.position, Electron.orbitState],
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

  // TODO: need to only clear if something is "selected"
  // and implement a "selected" vs "hovered state" / visuals
  @react({
    delay: 300,
  })
  clearPeekOnMouseOut = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      // if (!mouseOver) {
      //   App.setPeekTarget(null)
      // }
    },
  ]

  @react
  hideOrbitOnEsc = [
    () => Desktop.keyboardState.esc,
    () => {
      if (
        Desktop.state.focusedOnOrbit ||
        Electron.orbitState.mouseOver ||
        Electron.orbitState.fullScreen
      ) {
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
