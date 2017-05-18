// @flow
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
    delete: ['delete', 'backspace'],
  },
}

@store class Keys {
  active = {}

  start() {
    this.manager = new ShortcutManager(keymap)

    this.addEvent(window, 'keydown', (event: Event) => {
      if (event.shiftKey) {
        this.set('shift', true)
      }
    })

    this.addEvent(window, 'keyup', (event: Event) => {
      if (!event.shiftKey) {
        this.set('shift', false)
      }
    })
  }

  set = (key, val) => {
    this.active = { ...this.active, [key]: val }
  };
}

// singleton
export default new Keys()
