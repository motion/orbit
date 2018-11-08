import { globalShortcut } from 'electron'
import { Logger } from '@mcro/logger'

const log = new Logger('shortcutsStore')

type ShortcutsMap = { [key: string]: string }
type OnShortcut = (name: string, key: string) => any

export class ShortcutsStore {
  isRegistered = false
  shortcuts: ShortcutsMap = null
  onShortcutCb: OnShortcut = null

  constructor({ shortcuts, onShortcut }: { shortcuts: ShortcutsMap; onShortcut: OnShortcut }) {
    this.shortcuts = shortcuts
    this.onShortcutCb = onShortcut
  }

  unregisterShortcuts = () => {
    if (this.isRegistered) {
      this.isRegistered = false
      const shortcuts = this.shortcuts
      for (const shortcutKey in shortcuts) {
        const shortcut = this.shortcuts[shortcutKey]
        console.log('unregister', shortcut)
        globalShortcut.unregister(shortcut)
      }
    }
  }

  registerShortcuts = () => {
    this.isRegistered = true
    const shortcuts = this.shortcuts
    for (const shortcutKey in shortcuts) {
      const shortcut = shortcuts[shortcutKey]
      log.info('register shortcut', shortcutKey, shortcut)
      globalShortcut.register(shortcut, () => {
        this.onShortcutCb(shortcut, shortcutKey)
      })
    }
  }
}
