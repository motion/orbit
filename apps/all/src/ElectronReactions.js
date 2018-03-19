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
  @react
  shouldTogglePinned = [
    () => [App.state.shouldTogglePinned, Desktop.state.shouldTogglePin],
    Electron.togglePinned,
  ]

  @react
  unPinOnUnFullScreen = [
    () => Electron.orbitState.fullScreen,
    fullScreen => {
      if (!fullScreen) {
        Electron.setPinned(false)
      }
    },
    { delay: 50 },
  ]

  @react
  unFullScreenOnHide = [
    () => App.state.orbitHidden,
    hid => hid && Electron.setOrbitState({ fullScreen: false }),
  ]

  @react
  unFullScreenOnDefocus = [
    () => Desktop.state.appState,
    () => {
      if (Electron.orbitState.fullScreen) {
        Electron.setOrbitState({ fullScreen: false })
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

  @react
  handleHoldingOption = [
    () => Desktop.isHoldingOption,
    async (isHoldingOption, { sleep }) => {
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
        if (!App.state.orbitHidden) {
          Electron.setShouldHide(Date.now())
        }
        return
      }
      if (App.state.orbitHidden) {
        let uid = Math.random()
        console.log('hold uid', uid)
        await sleep(150)
        console.log('CONTINUEINGSAASA')
        Electron.setShouldShow(Date.now())
        await sleep(3500)
        console.log(`CONTINUE`, uid)
        Electron.setPinned(true)
      }
    },
    { delay: 16 },
  ]

  @react
  positionOrbitFullScreen = [
    () => Electron.orbitState.fullScreen,
    fullScreen => {
      if (!fullScreen) return
      const { round } = Math
      const [screenW, screenH] = screenSize()
      const [appW, appH] = [screenW / 1.5, screenH / 1.3]
      const [orbitW, orbitH] = [appW * 1 / 3, appH]
      const [orbitX, orbitY] = [(screenW - appW) / 2, (screenH - appH) / 2]
      const [peekW, peekH] = [appW * 2 / 3, appH]
      const [peekX, peekY] = [orbitX + orbitW, orbitY]
      Electron.setOrbitState({
        position: [orbitX, orbitY].map(round),
        size: [orbitW, orbitH].map(round),
        arrowTowards: 'right',
      })
      const [peek, ...rest] = Electron.peekState.windows
      peek.position = [peekX, peekY].map(round)
      peek.size = [peekW, peekH].map(round)
      peek.arrowTowards = 'left'
      Electron.setPeekState({ windows: [peek, ...rest] })
    },
  ]

  @react
  positionOrbitFromBoundingBox = [
    () => [appTarget(Desktop.state.appState || {}), Desktop.linesBoundingBox],
    ([appBB, linesBB]) => {
      if (Electron.orbitState.fullScreen) return
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
      Electron.setOrbitState({ position, size, arrowTowards })
    },
    true,
  ]
}
