import { Logger } from '@mcro/logger'
import { globalShortcut } from 'electron'

const log = new Logger('ElectronShortcutManager')

type ShortcutsMap = { [key: string]: string }
type OnShortcut = (name: string, key: string) => any

export class ElectronShortcutManager {
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
      console.log('unregister shortcuts', this.shortcuts)
      for (const shortcutKey in this.shortcuts) {
        const shortcut = this.shortcuts[shortcutKey]
        globalShortcut.unregister(shortcut)
      }
    }
  }

  registerShortcuts = () => {
    this.isRegistered = true
    log.info('register shortcuts', this.shortcuts)
    for (const name in this.shortcuts) {
      const shortcut = this.shortcuts[name]
      globalShortcut.register(shortcut, () => {
        this.onShortcutCb(name, shortcut)
      })
    }
  }
}
