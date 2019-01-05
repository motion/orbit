import { Desktop, App } from '@mcro/stores'
import { store, react, ensure } from '@mcro/black'
import { Screen } from '@mcro/screen'

const OPTION_PEEK_DELAY = 300

@store
export class KeyboardManager {
  pauseTm = null

  constructor({ screen }: { screen: Screen }) {
    // for now only sends option key event out
    console.log('should handle keyboard', screen)
    // screen.onKeyboard(this.onOptionKey)
  }

  downTm = null
  isOptionDown = false
  mouseActive = Date.now()

  onOptionKey = ({ type, value }) => {
    clearTimeout(this.downTm)
    if (value === 'esc') {
      Desktop.setKeyboardState({ escapeDown: Date.now() })
    }
    if (value === 'option') {
      switch (type) {
        case 'keyDown':
          this.isOptionDown = true
          this.downTm = setTimeout(() => {
            Desktop.setKeyboardState({ isHoldingOption: true })
          }, OPTION_PEEK_DELAY)
          return
        case 'keyUp':
          Desktop.setKeyboardState({ isHoldingOption: false })
          this.isOptionDown = false
          return
      }
    }
  }

  clearOnDocked = react(
    () => App.orbitState.docked,
    () => {
      this.resetHoldingOption()
      this.isOptionDown = false
    },
  )

  onMouseMove = () => {
    // this is if you want it to cancel if mouse ever moves
    if (!App.isShowingMenu) {
      this.resetHoldingOption()
      this.isOptionDown = false
    }

    // this is if you want it to open after mouse settles
    // if (this.isOptionDown) {
    //   this.mouseActive = Date.now()
    // }
    // if (!Desktop.keyboardState.isHoldingOption) {
    //   this.resetHoldingOption()
    // }
  }

  // if you hold option down and move your mouse before it opens we count that as a clear
  // and dont show the menu. but perhaps you did want it to open and accidently moved mouse a bit
  // in this case we can delay a little longer than usual and see you are still holding
  // and if so, re-set the state to show you are still holding
  // this should be a nice "learnable" behavior
  reOpenIfMouseSettles = react(
    () => this.mouseActive,
    async (_, { sleep }) => {
      await sleep(500)
      ensure('isOptionDown', this.isOptionDown)
      Desktop.setKeyboardState({ isHoldingOption: true })
    },
  )

  private resetHoldingOption() {
    clearTimeout(this.downTm)
    Desktop.setKeyboardState({ isHoldingOption: false })
  }
}
