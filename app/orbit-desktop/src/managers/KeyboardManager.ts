import { Desktop } from '@mcro/stores'
import { store } from '@mcro/black'
import { Oracle } from '@mcro/oracle'

@store
export class KeyboardManager {
  pauseTm = null
  keysDown = new Set()

  constructor({ oracle }: { oracle: Oracle }) {
    oracle.onKeyboard(({ type, value }) => {
      console.log('keyboad', type, value)
      switch (type) {
        case 'keyDown':
          Desktop.setKeyboardState({ option: Date.now() })
          return
        case 'keyUp':
          Desktop.setKeyboardState({ optionUp: Date.now() })
          return
      }
    })
  }
}
