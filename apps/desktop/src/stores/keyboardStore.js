import iohook from 'iohook'
import { Desktop } from '@mcro/all'
import { isEqual } from 'lodash'

const codes = {
  esc: 1,
  option: 56,
  optionRight: 3640,
  up: 57416,
  down: 57424,
  space: 57,
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

export default class KeyboardStore {
  // stores the last 4 keys pressed
  // but clears after a little, so it only stores "purposeful sequences"
  lastKeys = []
  // this is imperfect, iohook doesn't always match events perfectly
  // so in cases of errors, we clear it after a little delay
  keysDown = new Set()
  pauseTm = null

  constructor(opts = {}) {
    this.onKeyClear = opts.onKeyClear
  }

  start = () => {
    let clearLastKeys

    // keydown
    iohook.on('keydown', ({ keycode }) => {
      clearTimeout(clearLastKeys)
      this.lastKeys.push(['down', keycode])
      this.keysDown.add(keycode)
      this.clearDownKeysAfterPause()
      // log(`keydown: ${keycode}`)
      if (keycode === codes.esc) {
        return Desktop.updateKeyboard({ esc: Date.now() })
      }
      const isOption = keycode === codes.option || keycode === codes.optionRight
      if (this.keysDown.size > 1 && isOption) {
        log(`option: already holding ${this.keysDown.size} keys`)
        return Desktop.clearOption()
      }
      if (isOption) {
        log('option down')
        return Desktop.updateKeyboard({ option: Date.now() })
      }
      if (this.keysDown.has(codes.option)) {
        return Desktop.clearOption()
      }
      switch (keycode) {
        // clear highlights keys
        case codes.space:
          return Desktop.updateKeyboard({ space: Date.now() })
        case codes.up:
        case codes.down:
        case codes.pgUp:
        case codes.pgDown:
          if (this.onKeyClear) {
            this.onKeyClear()
          }
      }
    })

    // keyup
    iohook.on('keyup', ({ keycode }) => {
      clearTimeout(clearLastKeys)
      this.lastKeys.push(['up', keycode])
      while (this.lastKeys.length > 4) {
        this.lastKeys.shift() // ensure only 4 max
      }
      this.keysDown.delete(keycode)
      this.clearDownKeysAfterPause()
      // option off
      switch (keycode) {
        case codes.option:
          Desktop.clearOption()
          break
        case codes.space:
          Desktop.updateKeyboard({ space: null })
          break
      }
      if (isEqual(this.lastKeys, DOUBLE_TAP_OPTION)) {
        Desktop.setState({ shouldPin: Date.now() })
      }
      // be sure its a fast action not slow
      clearLastKeys = setTimeout(() => {
        this.lastKeys = []
      }, 350)
    })
  }

  clearDownKeysAfterPause = () => {
    clearTimeout(this.pauseTm)
    this.pauseTm = setTimeout(() => {
      this.keysDown.clear()
    }, 3000)
  }
}
