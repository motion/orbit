import { ORBIT_WIDTH } from '@o/constants'
import { QueryStore } from '@o/kit'
import { App } from '@o/stores'
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
        const bg = themeStore.themeColor === 'dark' ? '#111' : '#fff'
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

  updateAppOrbitStateOnResize = react(
    () => this.contentHeight,
    async (_, { sleep }) => {
      // sleep here because often the socket is actually faster than the html
      await sleep()
      App.setState({
        orbitState: {
          size: [ORBIT_WIDTH, this.contentHeight],
          position: [window.innerWidth - ORBIT_WIDTH - 10, 10],
        },
      })
    },
  )

  setContentHeight = height => {
    this.contentHeight = height
  }
}
