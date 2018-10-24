import { store, react, ensure } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import { Actions } from '../actions/Actions'
import { showNotification } from '../helpers/electron/showNotification'
import { PopoverState } from '@mcro/ui'
import { PaneManagerStore } from '../pages/OrbitPage/PaneManagerStore'

@store
export class AppReactions {
  // ew
  paneManagerStore: PaneManagerStore
  setPaneManagerStore = (store: PaneManagerStore) => {
    this.paneManagerStore = store
  }

  constructor() {
    this.setupReactions()
  }

  dispose() {
    this.subscriptions.dispose()
  }

  async setupReactions() {
    const dispose = App.onMessage(async (msg, value) => {
      console.log('app message', msg, Date.now())
      switch (msg) {
        case App.messages.TOGGLE_SHOWN:
          App.setOrbitState({ docked: !App.orbitState.docked })
          return
        case App.messages.HIDE:
          App.setOrbitState({ docked: false })
          return
        case App.messages.SHOW:
          App.setOrbitState({ docked: true })
          return
        case App.messages.HIDE_PEEK:
          return Actions.clearPeek()
        case App.messages.PIN:
          App.setOrbitState({ pinned: true })
          return
        case App.messages.UNPIN:
          App.setOrbitState({ pinned: false })
          return
        case App.messages.TOGGLE_PINNED:
          App.setOrbitState({ pinned: !App.orbitState.pinned })
          return
        case App.messages.NOTIFICATION:
          const val = JSON.parse(msg)
          showNotification({
            title: val.title,
            message: val.message,
          })
          return
        case App.messages.CLOSE_APP:
          Actions.closeApp(+value)
          return
      }
    })
    this.subscriptions.add({
      dispose,
    })
  }

  clearPeekOnOrbitClose = react(
    () => App.orbitState.docked,
    () => {
      ensure('is hidden', !App.orbitState.docked)
      Actions.clearPeek()
    },
  )

  clearPopoversOnMouseLeave = react(
    () => Electron.hoverState.orbitHovered || Electron.hoverState.peekHovered,
    hovered => {
      ensure('not hovered', !hovered)
      PopoverState.closeAll()
    },
  )
}
