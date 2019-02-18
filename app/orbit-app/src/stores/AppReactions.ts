import { ensure, react, store } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { PopoverState } from '@mcro/ui'
import { AppActions } from '../actions/appActions/AppActions'
import { showNotification } from '../helpers/electron/showNotification'

@store
export class AppReactions {
  listeners = []
  disposeListener = null

  constructor() {
    this.setupReactions()
  }

  dispose() {
    this.disposeListener()
    for (const listener of this.listeners) {
      listener()
    }
  }

  async setupReactions() {
    this.disposeListener = App.onMessage(async (msg, value) => {
      console.log('got a message', msg, value)
      switch (msg) {
        case App.messages.HIDE:
          App.setOrbitState({ docked: false })
          return
        case App.messages.SHOW:
          App.setOrbitState({ docked: true })
          return
        case App.messages.NOTIFICATION:
          const val = JSON.parse(msg)
          showNotification({
            title: val.title,
            message: val.message,
          })
          return
        case App.messages.CLOSE_APP:
          AppActions.closeApp(+value)
          return
      }
    })
  }

  clearPeekOnOrbitClose = react(
    () => App.orbitState.docked,
    () => {
      ensure('is hidden', !App.orbitState.docked)
      AppActions.clearPeek()
    },
    {
      deferFirstRun: true,
    },
  )

  clearPopoversOnMouseLeave = react(
    () => Desktop.hoverState.orbitHovered || Desktop.hoverState.appHovered,
    hovered => {
      ensure('not hovered', !hovered)
      PopoverState.closeAll()
    },
  )
}
