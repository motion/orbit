import { globalShortcut } from 'electron'
import { store } from '@mcro/black'

// @ts-ignore
@store
export class ShortcutsStore {
  onShortcutCb = _ => _

  constructor(shortcuts) {
    this.registerShortcuts(shortcuts)
  }

  onShortcut = cb => {
    this.onShortcutCb = cb
  }

  registerShortcuts = shortcuts => {
    for (const shortcut of shortcuts) {
      const ret = globalShortcut.register(shortcut, () => {
        this.onShortcutCb(shortcut)
      })
      if (!ret) {
        console.log('couldnt register shortcut', shortcut, ret)
      }
    }
  }
}
