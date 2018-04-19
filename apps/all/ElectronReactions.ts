import { store, react, sleep } from '@mcro/black/store'
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
  fullScreenOnOptionShift = [
    () => Desktop.isHoldingOptionShift,
    async (x, { sleep }) => {
      if (!x) {
        // if not mouse over active area, toggleFullScreen
        return
      }
      await sleep(100) // sleep because dont want to trigger this accidentaly
      console.log('send clear before fs or un-fs for quick hide test')
      Electron.onClear()
      this.toggleFullScreen()
    },
  ]

  @react
  unPinOnFullScreen = [
    () => Electron.orbitState.fullScreen,
    () => {
      if (!Electron.orbitState.pinned) {
        throw react.cancel
      }
      this.updatePinned(false)
    },
  ]

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
    ],
    async ([mP, isHidden, orbitPosition], { sleep }) => {
      if (isHidden) {
        if (Electron.orbitState.mouseOver) {
          Electron.setState({
            peekState: { mouseOver: false },
            orbitState: { mouseOver: false },
          })
        }
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
        if (mouseOver !== Electron.orbitState.mouseOver) {
          Electron.setOrbitState({ mouseOver })
        }
      }
      if (App.state.peekTarget || Electron.peekState.mouseOver) {
        const mouseOver = isMouseOver(Electron.currentPeek, mP)
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
      if (Electron.orbitState.pinned) {
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
  repositioningFromAppState = [
    () => [
      appTarget(Desktop.appState || {}),
      Desktop.linesBoundingBox,
      this.repositionToAppState,
    ],
    ([appBB, linesBB]) => {
      if (Constants.FORCE_FULLSCREEN) {
        throw react.cancel
      }
      const forceDocked = Electron.lastAction === 'CommandOrControl+Space'
      const box = linesBB || appBB // prefer using lines bounding box, fall back to app
      if (!box && !forceDocked) {
        throw react.cancel
      }
      console.log('positioning', forceDocked)
      let { position, size, orbitOnLeft, orbitDocked } = orbitPosition(
        box,
        forceDocked,
      )
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
        dockedPinned: orbitDocked && forceDocked,
        fullScreen: false,
      })
    },
  ]

  toggleFullScreen = () => {
    const fullScreen = !Electron.orbitState.fullScreen
    if (!fullScreen) {
      if (Electron.onClear) {
        Electron.onClear()
      }
      console.log('SHOULD REPOSITION AFTER FS')
      this.repositionToAppState = Date.now()
      return
    }
    // orbit props
    const { round } = Math
    const [screenW, screenH] = screenSize()
    const [appW, appH] = [screenW / 1.5, screenH / 1.3]
    const [orbitW, orbitH] = [appW * 1 / 3, appH]
    const [orbitX, orbitY] = [(screenW - appW) / 2, (screenH - appH) / 2]
    // peek props
    const [peekW, peekH] = [appW * 2 / 3, appH]
    const [peekX, peekY] = [orbitX + orbitW, orbitY]
    const [peek, ...rest] = Electron.peekState.windows
    peek.position = [peekX, peekY].map(round)
    peek.size = [peekW, peekH].map(round)
    peek.peekOnLeft = false
    // update
    Electron.setState({
      orbitState: {
        position: [orbitX, orbitY].map(round),
        size: [orbitW, orbitH].map(round),
        orbitOnLeft: true,
        fullScreen: true,
      },
      peekState: {
        windows: [peek, ...rest],
      },
    })
  }

  onShortcut = async shortcut => {
    if (shortcut === 'CommandOrControl+Space') {
      if (App.state.orbitHidden) {
        Electron.lastAction = shortcut
        this.repositionToAppState = Date.now()
        await sleep(80)
        Electron.sendMessage(App, App.messages.SHOW)
      } else {
        Electron.lastAction = null
        Electron.sendMessage(App, App.messages.HIDE)
      }
      return
    }
    if (shortcut === 'Option+Space') {
      if (Electron.orbitState.fullScreen) {
        this.toggleFullScreen()
        return
      }
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
    if (shortcut === 'Option+Shift+Space') {
      Electron.lastAction = shortcut
      this.toggleFullScreen()
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
}
