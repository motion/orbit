import { store, react } from '@mcro/black/store'
import iohook from 'iohook'
import { Desktop, Electron } from '@mcro/all'
import { isEqual } from 'lodash'
import debug from '@mcro/debug'

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

const log = debug('KeyboardStore')

@store
export default class KeyboardStore {
  // stores the last 4 keys pressed
  // but clears after a little, so it only stores "purposeful sequences"
  lastKeys = []
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
      this.keysDown.add(keycode)
      this.lastKeys.push(['down', keycode])
      this.clearDownKeysAfterPause()
      if (keycode === codes.esc) {
        return Desktop.setKeyboardState({ esc: Date.now() })
      }
      const isOption = keycode === codes.option || keycode === codes.optionRight
      const isShift = keycode === codes.shift || keycode === codes.shiftRight
      const isHoldingShift = this.keysDown.has(codes.shift)
      const holdingKeys = this.keysDown.size
      // clears:
      if (!isHoldingShift && holdingKeys > 1 && isOption) {
        return Desktop.clearOption()
      }
      const isHoldingOption = this.keysDown.has(codes.option)
      if (holdingKeys > 2 && isHoldingShift && isHoldingOption) {
        return Desktop.setKeyboardState({
          optionUp: Date.now(),
          spaceUp: Date.now(),
        })
      }
      if (isOption) {
        return Desktop.setKeyboardState({ option: Date.now() })
      }
      if (this.keysDown.has(codes.option) && !isHoldingShift) {
        return Desktop.clearOption()
      }
      switch (keycode) {
        case codes.shift:
          return Desktop.setKeyboardState({ shift: Date.now() })
        case codes.space:
          return Desktop.setKeyboardState({ space: Date.now() })
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

  onKeyDown = ({ keycode }) => {
    this.key = keycode
    this.keyAt = Date.now()
  }

  start = () => {
    let clearLastKeys

    // keydown
    iohook.on('keydown', this.onKeyDown)

    // keyup
    iohook.on('keyup', ({ keycode }) => {
      this.keysDown.delete(keycode)
      clearTimeout(clearLastKeys)
      this.lastKeys.push(['up', keycode])
      while (this.lastKeys.length > 4) {
        this.lastKeys.shift() // ensure only 4 max
      }
      this.clearDownKeysAfterPause()
      // option off
      switch (keycode) {
        case codes.shift:
          Desktop.setKeyboardState({ shiftUp: Date.now() })
          break
        case codes.option:
          Desktop.clearOption()
          break
        case codes.space:
          Desktop.setKeyboardState({ spaceUp: Date.now() })
          break
      }
      if (isEqual(this.lastKeys, DOUBLE_TAP_OPTION)) {
        Desktop.sendMessage(Electron, Electron.messages.TOGGLE_PINNED)
      }
      // be sure its a fast action not slow
      clearLastKeys = setTimeout(() => {
        this.lastKeys = []
      }, 150)
    })
  }

  clearDownKeysAfterPause = () => {
    clearTimeout(this.pauseTm)
    this.pauseTm = setTimeout(() => {
      this.keysDown.clear()
    }, 3000)
  }
}
