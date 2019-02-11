import { react } from '@mcro/black'
import { ORBIT_WIDTH } from '@mcro/constants'
import { App, Electron } from '@mcro/stores'
import { AppReactions } from './AppReactions'
import { Pane } from './PaneManagerStore'
import { QueryStore } from './QueryStore/QueryStore'

export class OrbitWindowStore {
  props: {
    queryStore: QueryStore
  }

  activePaneIndex = 0
  contentHeight = 0
  inputFocused = false
  isTorn = false
  lastActivePane: Pane | null = null

  onFocus = () => {
    this.inputFocused = true
  }

  onBlur = () => {
    this.inputFocused = false
  }

  setLastActivePane = (pane: Pane) => {
    this.lastActivePane = pane
  }

  get contentBottom() {
    // always leave x room at bottom
    // leaving a little room at the bottom makes it feel much lighter
    return window.innerHeight - this.contentHeight
  }

  setTorn = (type: string) => {
    this.isTorn = true
    console.log('Tearing away app', type)
    const appCount = App.state.appCount + 1
    App.setState({ appCount })
    App.sendMessage(Electron, Electron.messages.TEAR_APP, {
      appType: type,
      appId: appCount,
    })
    // set App.orbitState.docked false so next orbit window is hidden on start
    // TODO clean up tearing a bit, including this settimeout
    // for now its just happening becuase i dont want to deal with having a proper system
    // for managing the torn windows so we're putting state on Electron.isTorn, here, etc
    setTimeout(() => {
      App.setOrbitState({ docked: false })
    }, 150)
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
