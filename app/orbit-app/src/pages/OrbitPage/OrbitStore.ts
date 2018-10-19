import { react } from '@mcro/black'
import { App } from '@mcro/stores'
import { ORBIT_WIDTH } from '@mcro/constants'
import { AppReactions } from '../../stores/AppReactions'

export class OrbitStore {
  contentHeight = 0
  onPinKeyCB = null
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

  appReactionsStore = new AppReactions({
    onPinKey: key => this.onPinKeyCB(key),
  })

  async willMount() {
    // show orbit on startup
    App.setOrbitState({
      docked: true,
    })
  }

  willUnmount() {
    this.appReactionsStore.dispose()
  }

  onPinKey = cb => {
    this.onPinKeyCB = cb
  }

  updateAppOrbitStateOnResize = react(
    () => this.contentHeight,
    () => {
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
