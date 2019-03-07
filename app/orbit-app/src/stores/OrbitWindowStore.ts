import { ORBIT_WIDTH } from '@mcro/constants'
import { QueryStore } from '@mcro/kit'
import { App } from '@mcro/stores'
import { react, useHook } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'

export class OrbitWindowStore {
  stores = useHook(useStoresSimple)

  props: {
    queryStore: QueryStore
  }

  get themeStore() {
    return this.stores.themeStore
  }

  syncBackgroundToVibrancy = react(
    () => this.themeStore.vibrancy === 'none',
    disabled => {
      if (disabled) {
        const bg = this.themeStore.themeColor === 'dark' ? '#111' : '#fff'
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
      App.setOrbitState({
        size: [ORBIT_WIDTH, this.contentHeight],
        position: [window.innerWidth - ORBIT_WIDTH - 10, 10],
      })
    },
  )

  setContentHeight = height => {
    this.contentHeight = height
  }
}
