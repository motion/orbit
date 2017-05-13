import { store } from '~/helpers'
import { ShortcutManager } from 'react-shortcuts'

const keymap = {
  ALL: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
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
