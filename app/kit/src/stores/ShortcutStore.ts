export class ShortcutStore {
  shortcutListeners = new Set()

  onShortcut(cb: (a: string) => any) {
    this.shortcutListeners.add(cb)
    return () => {
      this.shortcutListeners.delete(cb)
    }
  }

  emit(shortcut: string) {
    for (const cb of [...this.shortcutListeners]) {
      cb(shortcut)
    }
  }
}
