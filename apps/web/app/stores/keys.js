import { store } from '~/helpers'
import { ShortcutManager } from 'react-shortcuts'

const keymap = {
  ALL: {
    MOVE_LEFT: 'left',
    MOVE_RIGHT: 'right',
    MOVE_UP: 'up',
    MOVE_DOWN: 'down',
    ENTER: 'enter',
  },
}

@store class Keys {
  start() {
    this.manager = new ShortcutManager(keymap)
  }
}

// singleton
export default new Keys()
