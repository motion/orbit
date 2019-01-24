import { ensure, react } from '@mcro/black'
import { Logger } from '@mcro/logger'
import { App, Desktop, Electron } from '@mcro/stores'
import { ElectronShortcutManager } from '../helpers/ElectronShortcutManager'

const log = new Logger('ShortcutsManager')

const peekTriggers = 'abcdefghijzlmnopqrstuvwxyz0123456789'

export class OrbitShortcutsStore {
  props: {
    onToggleOpen?: Function
  }
  disposed = false

  didMount() {
    this.globalShortcut.registerShortcuts()
  }

  dispose() {
    this.disposed = true
    this.globalShortcut.unregisterShortcuts()
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
      ensure('not disposed', !this.disposed)
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
      ensure('not torn', !this.disposed)
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
