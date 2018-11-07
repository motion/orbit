import { App, Desktop } from '@mcro/stores'
import { store } from '@mcro/black'
import { Oracle } from '@mcro/oracle'

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

@store
export class KeyboardManager {
  pauseTm = null
  keysDown = new Set()

  constructor({ oracle }: { oracle: Oracle }) {
    let clearLastKeys
    oracle.onKeyboard(({ type, value }) => {
      console.log('keyboad', type, value)
      switch (type) {
        case 'keyDown':
          this.keysDown.add(value)
          this.onKey(value)
          return
        case 'keyUp':
          this.keysDown.delete(value)
          clearTimeout(clearLastKeys)
          this.clearDownKeysAfterPause()
          if (value === codes.option) {
            this.clearOption()
          }
          return
      }
    })
  }

  onKey = keycode => {
    this.clearDownKeysAfterPause()
    if (keycode === codes.esc) {
      // Desktop.sendMessage(App, App.messages.HIDE)
      // return
    }
    const isOption = keycode === codes.option || keycode === codes.optionRight
    const holdingKeys = this.keysDown.size
    // clears:
    if (holdingKeys > 1 && isOption) {
      return this.clearOption()
    }
    const isHoldingOption = this.keysDown.has(codes.option)
    // holding option + press key === pin
    if (isHoldingOption && App.showingPeek) {
      // a - z, our secret pin keys, let them go
      if (keycode >= 14 && keycode <= 49) {
        return
      }
    }
    if (isOption) {
      return Desktop.setKeyboardState({ option: Date.now() })
    }
    if (this.keysDown.has(codes.option)) {
      return this.clearOption()
    }
  }

  clearOption = () => {
    Desktop.setKeyboardState({ optionUp: Date.now() })
  }

  clearDownKeysAfterPause = () => {
    clearTimeout(this.pauseTm)
    this.pauseTm = setTimeout(() => {
      this.keysDown.clear()
    }, 3000)
  }
}
