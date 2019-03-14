import { Logger } from '@o/logger'
import { App, Desktop, Electron } from '@o/stores'
import { react } from '@o/use-store'
import { ElectronShortcutManager } from '../helpers/ElectronShortcutManager'

const log = new Logger('ShortcutsManager')

const peekTriggers = 'abcdefghijzlmnopqrstuvwxyz0123456789'

export class OrbitShortcutsStore {
  props: {
    onToggleOpen?: Function
  }

  start() {
    this.globalShortcut.registerShortcuts()
  }

  dispose() {
    this.globalShortcut.unregisterShortcuts()
    this.peekShortcuts.unregisterShortcuts()
  }

  // global shortcuts
  // TODO make it update when they change it...
  globalShortcut = new ElectronShortcutManager({
    shortcuts: {
      toggleApp: 'Option+Space',
    },
    onShortcut: () => {
      if (this.props.onToggleOpen) {
        this.props.onToggleOpen()
      }
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

  // these are basically unused until/if we bring back peek:

  peekShortcuts = new ElectronShortcutManager({
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
    onShortcut: shortcut => {
      console.log('got shortcut', shortcut)
      if (shortcut.indexOf('optionAnd') === 0) {
        const name = shortcut.replace('optionAnd', '').toLowerCase()
        Electron.setState({ pinKey: { name, at: Date.now() } })
      }
    },
  })

  enablePeekShortcutsWhenHoldingOption = react(
    () => Desktop.keyboardState.isHoldingOption,
    async (optionDown, { sleep }) => {
      if (optionDown) {
        await sleep(500)
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
