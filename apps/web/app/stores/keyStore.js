// @flow
import { store } from '@jot/black'
import { ShortcutManager } from 'react-shortcuts'

const keymap = {
  all: {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
    enter: 'enter',
    esc: 'esc',
    commander: 'command+t',
    delete: ['delete', 'backspace'],
  },
}

export default class KeyStore {
  active = {}
  manager = new ShortcutManager(keymap)

  start() {
    this.on(window, 'keydown', (event: Event) => {
      if (event.shiftKey) {
        this.set('shift', true)
      }
    })

    this.on(window, 'keyup', (event: Event) => {
      if (!event.shiftKey) {
        this.set('shift', false)
      }
    })
  }

  set = (key, val) => {
    this.active = { ...this.active, [key]: val }
  };

  handleShortcuts = (action, event: KeyboardEvent) => {
    if (action) {
      this.emit('key', { action, event })
    }
  }
}
