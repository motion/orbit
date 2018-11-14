import { store, react } from '@mcro/black'
import { App, Electron, Desktop } from '@mcro/stores'
import { ShortcutsStore } from '../stores/ShortcutsStore'
import { Logger } from '@mcro/logger'

const log = new Logger('ShortcutsManager')

const peekTriggers = 'abcdefghijzlmnopqrstuvwxyz0123456789'

@store
export class ShortcutsManager {
  constructor() {
    this.globalShortcut.registerShortcuts()
  }

  // global shortcuts
  // TODO make it update when they change it...
  globalShortcut = new ShortcutsStore({
    shortcuts: {
      toggleApp: 'Option+Space',
    },
    onShortcut() {
      const shown = App.orbitState.docked
      Electron.sendMessage(App, shown ? App.messages.HIDE : App.messages.SHOW)
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

  peekShortcuts = new ShortcutsStore({
    shortcuts: {
      optionAndDown: 'Option+Down',
      optionAndLeft: 'Option+Left',
      optionAndRight: 'Option+Right',
      optionAndUp: 'Option+Up',
      ...peekTriggers.split('').reduce(
        (acc, letter) => ({
          ...acc,
          [`optionAnd${letter}`]: `Option+${letter}`,
        }),
        {},
      ),
    },
    onShortcut(shortcut) {
      console.log('got shortcut', shortcut)
      if (shortcut.indexOf('optionAnd') === 0) {
        const name = shortcut.replace('optionAnd', '').toLowerCase()
        Electron.setState({ pinKey: { name, at: Date.now() } })
      }
    },
  })

  enablePeekShortcutsWhenHoldingOption = react(
    () => Desktop.keyboardState.isHoldingOption,
    async optionDown => {
      if (optionDown) {
        this.peekShortcuts.registerShortcuts()
      } else {
        this.peekShortcuts.unregisterShortcuts()
      }
    },
    {
      deferFirstRun: true,
    },
  )
}
