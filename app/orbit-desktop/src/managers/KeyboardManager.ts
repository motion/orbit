import { Desktop, App } from '@mcro/stores'
import { store, react } from '@mcro/black'
import { Oracle } from '@mcro/oracle'

const OPTION_PEEK_DELAY = 200

@store
export class KeyboardManager {
  pauseTm = null

  constructor({ oracle }: { oracle: Oracle }) {
    // for now only sends option key event out
    oracle.onKeyboard(this.onOptionKey)
  }

  downTm = null

  onOptionKey = ({ type }) => {
    clearTimeout(this.downTm)
    switch (type) {
      case 'keyDown':
        this.downTm = setTimeout(() => {
          Desktop.setKeyboardState({ isHoldingOption: true })
        }, OPTION_PEEK_DELAY)
        return
      case 'keyUp':
        Desktop.setKeyboardState({ isHoldingOption: false })
        return
    }
  }

  clearOnDocked = react(
    () => App.orbitState.docked,
    () => {
      clearTimeout(this.downTm)
      Desktop.setKeyboardState({ isHoldingOption: false })
    },
  )
}
