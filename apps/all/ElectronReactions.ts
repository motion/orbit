import { store } from '@mcro/black/store'
import { App } from './App'
import { Electron } from './Electron'
import debug from '@mcro/debug'

const log = debug('ElectronReactions')

@store
export default class ElectronReactions {
  onShortcut = async shortcut => {
    if (shortcut === 'CommandOrControl+Space') {
      Electron.sendMessage(App, App.messages.TOGGLE_DOCKED)
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
}
