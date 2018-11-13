import { store, react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { AppActions } from '../actions/AppActions'
import { showNotification } from '../helpers/electron/showNotification'
import { PopoverState } from '@mcro/ui'

@store
export class AppReactions {
  listeners = []

  constructor() {
    this.setupReactions()
  }

  dispose() {
    this.dispose()
    for (const listener of this.listeners) {
      listener()
    }
  }

  async setupReactions() {
    this.dispose = App.onMessage(async (msg, value) => {
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

      // this.disposeToggleSettings = App.onMessage(App.messages.TOGGLE_SETTINGS, () => {
      //   this.setActivePane('settings')
      //   App.setOrbitState({ docked: true })
      // })

      // this.disposeShowApps = App.onMessage(App.messages.SHOW_APPS, () => {
      //   this.setActivePane('apps')
      //   App.setOrbitState({ docked: true })
      // })
    })
  }

  clearPeekOnOrbitClose = react(
    () => App.orbitState.docked,
    () => {
      ensure('is hidden', !App.orbitState.docked)
      AppActions.clearPeek()
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
