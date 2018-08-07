import { globalShortcut } from 'electron'
import { store, react } from '@mcro/black'
import { App } from '@mcro/stores'
import debug from '@mcro/debug'

const log = debug('shortcutsStore')

// @ts-ignore
@store
export class ShortcutsStore {
  onShortcutCb = _ => _
  shortcuts = null

  constructor(shortcuts) {
    this.shortcuts = shortcuts
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
    for (const shortcut of this.shortcuts) {
      globalShortcut.unregister(shortcut)
    }
  }

  registerShortcuts = () => {
    for (const shortcut of this.shortcuts) {
      const ret = globalShortcut.register(shortcut, () => {
        this.onShortcutCb(shortcut)
      })
      if (!ret) {
        console.log('couldnt register shortcut', shortcut, ret)
      }
    }
  }
}
