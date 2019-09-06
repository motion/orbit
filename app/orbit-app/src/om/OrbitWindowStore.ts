import { QueryStore } from '@o/kit'
import { react } from '@o/use-store'

import { themeStore } from './stores'

export class OrbitWindowStore {
  props: {
    queryStore: QueryStore
  } = {
    queryStore: null as any,
  }

  syncBackgroundToVibrancy = react(
    () => themeStore.vibrancy === 'none',
    disabled => {
      if (disabled) {
        const bg = themeStore.themeColor === 'dark' ? '#333' : '#fff'
        document.body.style.background = bg
      } else {
        document.body.style.background = 'transparent'
      }
    },
  )

  contentHeight = 0
  inputFocused = false

  onFocus = () => {
    this.inputFocused = true
  }

  onBlur = () => {
    this.inputFocused = false
  }

  get contentBottom() {
    // always leave x room at bottom
    // leaving a little room at the bottom makes it feel much lighter
    return window.innerHeight - this.contentHeight
  }
}
