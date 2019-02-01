import { react } from '@mcro/black'
import { ORBIT_WIDTH } from '@mcro/constants'
import { App } from '@mcro/stores'
import { AppReactions } from './AppReactions'
import { QueryStore } from './QueryStore/QueryStore'

export class OrbitWindowStore {
  props: {
    queryStore: QueryStore
  }

  activePaneIndex = 0
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

  appReactionsStore = new AppReactions()

  willUnmount() {
    this.appReactionsStore.dispose()
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
