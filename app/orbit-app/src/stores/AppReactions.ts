import { store, react, ensure } from '@mcro/black'
import { App, Electron } from '@mcro/stores'
import { AppActions } from '../actions/AppActions'
import { showNotification } from '../helpers/electron/showNotification'
import { PopoverState } from '@mcro/ui'
import { Actions, TrayActions } from '../actions/Actions'

@store
export class AppReactions {
  listeners = []

  constructor() {
    this.setupReactions()

    const off = Actions.listenAll((key, value) => {
      switch (key) {
        case 'TrayToggleOrbit':
          App.setOrbitState({ docked: !App.state.orbitState.docked })
          break
        case 'TrayHoverMemory':
        case 'TrayHoverPin':
        case 'TrayHoverOrbit':
        case 'TrayHoverOut':
          App.setState({
            trayState: {
              trayEvent: key,
              trayEventAt: value,
            },
          })
          break
      }
    })
    this.listeners.push(off)
  }

  dispose() {
    this.dispose()
    for (const listener of this.listeners) {
      listener()
    }
  }

  async setupReactions() {
    this.dispose = App.onMessage(async (msg, value) => {
      switch (msg) {
        case App.messages.TRAY_EVENT:
          Actions.dispatch(value as keyof TrayActions, Date.now())
          return
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
  )

  clearPopoversOnMouseLeave = react(
    () => Electron.hoverState.orbitHovered || Electron.hoverState.peekHovered,
    hovered => {
      ensure('not hovered', !hovered)
      PopoverState.closeAll()
    },
  )
}
