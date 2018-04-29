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
      if (App.state.orbitHidden) {
        Electron.sendMessage(App, App.messages.SHOW_DOCKED)
      } else {
        Electron.sendMessage(App, App.messages.HIDE_DOCKED)
      }
      return
    }
    if (shortcut === 'Option+Space') {
      if (App.state.orbitHidden) {
        this.toggleVisible()
        this.updatePinned(true)
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
    if (App.state.orbitHidden) {
      Electron.sendMessage(App, App.messages.HIDE)
    } else {
      Electron.sendMessage(App, App.messages.SHOW)
    }
  }

  togglePinned = () => {
    Electron.sendMessage(App, App.messages.TOGGLE_PINNED)
  }

  @react
  unPinOnHidden = [
    () => App.isFullyHidden,
    hidden => {
      if (!hidden) {
        throw react.cancel
      }
      this.updatePinned(false)
    },
  ]

  // one source of truth
  // since electron needs to do stuff
  // it handles it here primarily

  @react
  handleHoldingOption = [
    () => Desktop.isHoldingOption,
    async (isHoldingOption, { sleep }) => {
      if (App.orbitState.pinned || App.dockState.pinned) {
        throw react.cancel
      }
      if (!isHoldingOption) {
        if (!App.orbitState.pinned && App.isMouseInActiveArea) {
          log('prevent hide while mouseover after release hold')
          throw react.cancel
        }
        Electron.sendMessage(App, App.messages.HIDE)
        throw react.cancel
      }
      await sleep(140)
      Electron.sendMessage(App, App.messages.SHOW)
      // await sleep(3500)
      // this.updatePinned(true)
    },
  ]

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
