import { store, react, isEqual } from '@mcro/black/store'
import iohook from 'iohook'
import { Desktop, App, Electron } from '@mcro/all'
// import debug from '@mcro/debug'
// const log = debug('KeyboardStore')

const codes = {
  esc: 1,
  option: 56,
  optionRight: 3640,
  up: 57416,
  down: 57424,
  space: 57,
  shift: 42,
  shiftRight: 54,
  pgUp: 3657,
  pgDown: 3665,
}

const DOUBLE_TAP_OPTION = [
  ['down', codes.option],
  ['up', codes.option],
  ['down', codes.option],
  ['up', codes.option],
]

// stores the last 4 keys pressed
// but clears after a little, so it only stores "purposeful sequences"
let lastKeys = []

@store
export default class KeyboardStore {
  // this is imperfect, iohook doesn't always match events perfectly
  // so in cases of errors, we clear it after a little delay
  keysDown = new Set()
  pauseTm = null
  onKeyClear?: Function

  constructor(opts: { onKeyClear?: Function } = {}) {
    this.onKeyClear = opts.onKeyClear
  }

  key = null
  keyAt = 0

  @react({ log: false })
  onKey = [
    () => [this.key, this.keyAt],
    ([keycode]) => {
      this.clearDownKeysAfterPause()
      if (keycode === codes.esc) {
        if (
          App.peekState.target &&
          (App.isMouseInActiveArea || Desktop.state.focusedOnOrbit)
        ) {
          Desktop.sendMessage(App, App.messages.HIDE_PEEK)
          return
        }
        if (!App.orbitState.docked && !App.isMouseInActiveArea) {
          return
        }
        Desktop.sendMessage(App, App.messages.HIDE)
        return
      }
      const isOption = keycode === codes.option || keycode === codes.optionRight
      // const isShift = keycode === codes.shift || keycode === codes.shiftRight
      const holdingKeys = this.keysDown.size
      // clears:
      if (holdingKeys > 1 && isOption) {
        return Desktop.clearOption()
      }
      const isHoldingOption = this.keysDown.has(codes.option)
      // holding option + press key === pin
      if (isHoldingOption && App.isShowingOrbit) {
        // a - z, our secret pin keys, let them go
        if (keycode >= 14 && keycode <= 49) {
          return
        }
      }
      if (isOption) {
        return Desktop.setKeyboardState({ option: Date.now() })
      }
      if (this.keysDown.has(codes.option)) {
        return Desktop.clearOption()
      }
      switch (keycode) {
        // case codes.shift:
        //   return Desktop.setKeyboardState({ shift: Date.now() })
        // case codes.space:
        //   return Desktop.setKeyboardState({ space: Date.now() })
        case codes.up:
        case codes.down:
        case codes.pgUp:
        case codes.pgDown:
          if (this.onKeyClear) {
            this.onKeyClear()
          }
      }
    },
  ]

  keyDown = keycode => {
    this.key = keycode
    this.keyAt = Date.now()
  }

  start = () => {
    let clearLastKeys

    // keydown
    iohook.on('keydown', ({ keycode }) => {
      this.keysDown.add(keycode)
      lastKeys.push(['down', keycode])
      this.keyDown(keycode)
    })

    // keyup
    iohook.on('keyup', ({ keycode }) => {
      this.keysDown.delete(keycode)
      clearTimeout(clearLastKeys)
      lastKeys.push(['up', keycode])
      while (lastKeys.length > 4) {
        lastKeys.shift() // ensure only 4 max
      }
      this.clearDownKeysAfterPause()
      // option off
      switch (keycode) {
        // case codes.shift:
        //   Desktop.setKeyboardState({ shiftUp: Date.now() })
        //   break
        case codes.option:
          Desktop.clearOption()
          break
        // case codes.space:
        //   Desktop.setKeyboardState({ spaceUp: Date.now() })
        // break
      }
      if (isEqual(lastKeys, DOUBLE_TAP_OPTION)) {
        Desktop.sendMessage(App, App.messages.TOGGLE_PINNED)
      }
      // be sure its a fast action not slow
      clearLastKeys = setTimeout(() => {
        lastKeys = []
      }, 190)
    })
  }

  clearDownKeysAfterPause = () => {
    clearTimeout(this.pauseTm)
    this.pauseTm = setTimeout(() => {
      this.keysDown.clear()
    }, 3000)
  }
}
