import { store, react, sleep } from '@mcro/black/store'
import { App } from './App'
import { Desktop } from './Desktop'
import { Electron } from './Electron'
import peekPosition from './helpers/peekPosition'
import debug from '@mcro/debug'

const log = debug('ElectronReactions')

@store
export default class ElectronReactions {
  onShortcut = async shortcut => {
    if (shortcut === 'CommandOrControl+Space') {
      if (App.orbitState.hidden) {
        Electron.sendMessage(App, App.messages.SHOW_DOCKED)
      } else {
        Electron.sendMessage(App, App.messages.HIDE_DOCKED)
      }
      return
    }
    if (shortcut === 'Option+Space') {
      if (App.orbitState.hidden) {
        this.toggleVisible()
        Electron.sendMessage(App, App.messages.PIN)
        return
      }
      if (App.orbitState.pinned) {
        this.togglePinned()
        this.toggleVisible()
        return
      } else {
        // !pinned
        this.togglePinned()
      }
    }
  }

  toggleVisible = () => {
    if (App.orbitState.hidden) {
      Electron.sendMessage(App, App.messages.HIDE)
    } else {
      Electron.sendMessage(App, App.messages.SHOW)
    }
  }

  togglePinned = () => {
    Electron.sendMessage(App, App.messages.TOGGLE_PINNED)
  }

  @react({ fireImmediately: true })
  peekPosition = [
    () => App.state.peekTarget,
    peekTarget => {
      if (!peekTarget) {
        throw react.cancel
      }
      Electron.setPeekState({
        id: Math.random(),
        ...peekPosition(peekTarget.position, App),
      })
    },
  ]
}
