import { globalShortcut } from 'electron'
import { store } from '@mcro/black'

@store
export default class ShortcutsStore {
  constructor(shortcuts = ['Option+Space']) {
    this.registerShortcuts(shortcuts)
  }

  registerShortcuts = shortcuts => {
    for (const shortcut of shortcuts) {
      const ret = globalShortcut.register(shortcut, () => {
        this.emit('shortcut', shortcut)
      })
      if (!ret) {
        console.log('couldnt register shortcut')
      }
    }
  }
}
