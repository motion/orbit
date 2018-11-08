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
      ...peekTriggers.split('').reduce(
        (acc, letter) => ({
          ...acc,
          [`optionLetter${letter}`]: `Option+${letter}`,
        }),
        {},
      ),
    },
    onShortcut(name) {
      if (name.indexOf('optionLetter') === 0) {
        Electron.setState({ pinKey: { name: name.replace('optionShortcut', ''), at: Date.now() } })
      }
    },
  })

  enablePeekShortcutsWhenHoldingOption = react(
    () => Desktop.isHoldingOption,
    async (optionDown, { sleep }) => {
      if (optionDown) {
        // debounce before registering
        await sleep(200)
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
