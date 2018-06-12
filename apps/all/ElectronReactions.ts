import { store } from '@mcro/black/store'
import { App } from './App'
import { Electron } from './Electron'
// import { Desktop } from './Desktop'

@store
export class ElectronReactions {
  onShortcut = async shortcut => {
    console.log('shortcut', shortcut)
    if (shortcut === 'CommandOrControl+Space') {
      console.log('send toggle docked')
      Electron.sendMessage(App, App.messages.TOGGLE_DOCKED)
      return
    }
    // if (shortcut === 'Option+Space') {
    //   if (App.orbitState.hidden) {
    //     this.toggleVisible()
    //     Electron.sendMessage(App, App.messages.PIN)
    //     return
    //   }
    //   if (App.orbitState.pinned) {
    //     Electron.sendMessage(Desktop, Desktop.messages.CLEAR_OPTION)
    //     Electron.sendMessage(App, App.messages.HIDE)
    //     Electron.sendMessage(App, App.messages.UNPIN)
    //     return
    //   } else {
    //     // !pinned
    //     this.togglePinned()
    //   }
    // }
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
