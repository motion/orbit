import { globalShortcut } from 'electron'
import { store, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { logger } from '@mcro/logger'

const log = logger('shortcutsStore')

// @ts-ignore
@store
export class ShortcutsStore {
  onShortcutCb = _ => _
  setting = {
    values: {
      shortcuts: {
        toggleApp: 'Option+Space',
      },
    },
  }
  // TODO: make it watch setting model
  // setting$ = getRepository(SettingEntity)

  constructor() {
    this.registerShortcuts()
  }

  onShortcut = cb => {
    this.onShortcutCb = cb
  }

  disableShortcutsDuringShortcutInputFocus = react(
    () => App.orbitState.shortcutInputFocused,
    focused => {
      if (focused) {
        log('Removing global shortcut temporarily...')
        this.unregisterShortcuts()
      } else {
        log('Restoring global shortcut...')
        this.registerShortcuts()
      }
    },
  )

  unregisterShortcuts = () => {
    const shortcuts = this.setting.values.shortcuts
    for (const shortcutKey in shortcuts) {
      const shortcut = shortcutKey
      globalShortcut.unregister(shortcut)
    }
  }

  registerShortcuts = () => {
    const shortcuts = this.setting.values.shortcuts
    for (const shortcutKey in shortcuts) {
      const shortcut = shortcuts[shortcutKey]
      log('register shortcut', shortcutKey, shortcut)
      globalShortcut.register(shortcut, () => {
        this.onShortcutCb(shortcut)
      })
    }
  }
}
