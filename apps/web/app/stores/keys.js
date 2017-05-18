import { store } from '~/helpers'
import { ShortcutManager } from 'react-shortcuts'

const keymap = {
  all: {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
    enter: 'enter',
    esc: 'esc',
    delete: 'delete',
  },
}

@store class Keys {
  start() {
    this.manager = new ShortcutManager(keymap)
  }
}

// singleton
export default new Keys()
