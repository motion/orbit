// @flow
import { store, react } from '@mcro/black/store'
import Desktop from './Desktop'
import Electron from './Electron'
import App from './App'

const log = debug('AppReactions')

@store
export default class AppReactions {
  @react
  showHideApp = [
    () => App.state.openResult,
    () => App.setState({ orbitHidden: true }),
  ]

  @react
  showHideFromElectron = [
    () => [Electron.state.shouldHide, Electron.state.shouldShow],
    ([shouldHide, shouldShow]) => {
      if (!shouldHide && !shouldShow) {
        return
      }
      const isHidden = App.state.orbitHidden
      const willBeHidden = shouldHide > shouldShow
      // TODO implement this
      const PEEK_IS_FOCUSED = false
      if (PEEK_IS_FOCUSED && !isHidden && willBeHidden) {
        log(`Peek is focused, ignore hide`)
        return
      }
      log(`orbitHidden: ${willBeHidden}`)
      App.setState({ orbitHidden: willBeHidden })
    },
    true,
  ]

  @react
  clearPeekOnMouseOut = [
    () => Electron.isMouseInActiveArea,
    mouseOver => {
      if (!mouseOver && !App.state.peekTarget) {
        console.log('CLEAR clearPeekOnMouseOut')
        App.setState({ peekTarget: null })
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
        console.log('CLEAR fullScreen')
        App.setState({ peekTarget: null })
      }
    },
  ]

  @react
  hideOrbitOnEsc = [
    () => Desktop.state.keyboard.esc,
    () => {
      if (!App.state.orbitHidden) {
        App.setState({ orbitHidden: true })
      }
    },
  ]

  @react
  showOrbitOnPin = [
    () => Electron.orbitState.pinned,
    pinned => App.setState({ orbitHidden: !pinned }),
  ]

  @react
  hideOrbitOnMouseOut = [
    () => [
      !App.state.orbitHidden,
      Electron.orbitState.pinned,
      Electron.orbitState.mouseOver || Electron.peekState.mouseOver,
    ],
    ([isShown, isPinned, mouseOver]) => {
      if (Desktop.isHoldingOption) {
        return
      }
      if (isShown && !isPinned && !mouseOver) {
        log(
          `hiding because your mouse moved outside the window after option release`,
        )
        App.setState({ orbitHidden: true })
      }
    },
  ]

  @react
  showOrbitOnHoverWord = [
    () => App.hoveredWordName,
    word => {
      if (Desktop.isHoldingOption) {
        return
      }
      clearTimeout(this.hoverShow)
      const orbitHidden = !word
      this.hoverShow = setTimeout(() => {
        console.log('sethidden based on word', orbitHidden)
        App.setState({ orbitHidden })
      }, orbitHidden ? 50 : 500)
    },
  ]
}
