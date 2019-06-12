import { Logger } from '@o/logger'
import { App, Electron } from '@o/stores'
import { createUsableStore, react } from '@o/use-store'

import { ElectronShortcutManager } from '../helpers/ElectronShortcutManager'

const log = new Logger('ShortcutsManager')

class OrbitShortcutsStore {
  start() {
    this.globalShortcut.registerShortcuts()
  }

  dispose() {
    this.globalShortcut.unregisterShortcuts()
  }

  // global shortcuts
  // TODO make it update when they change it...
  globalShortcut = new ElectronShortcutManager({
    shortcuts: {
      toggleApp: 'Option+Space',
    },
    onShortcut: () => {
      Electron.setState({
        showMain: !Electron.state.showMain,
      })
    },
  })

  disableGlobalShortcutsDuringShortcutSettingInputFocus = react(
    () => App.orbitState.shortcutInputFocused,
    focused => {
      if (focused) {
        log.info('Removing global shortcut temporarily...')
        this.globalShortcut.unregisterShortcuts()
      } else {
        log.info('Restoring global shortcut...')
        this.globalShortcut.registerShortcuts()
      }
    },
    {
      deferFirstRun: true,
    },
  )
}

export const orbitShortcutsStore = createUsableStore(OrbitShortcutsStore)
