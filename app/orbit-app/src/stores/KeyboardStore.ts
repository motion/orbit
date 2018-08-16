import { on } from '@mcro/black'

export class KeyboardStore {
  didMount() {
    on(this, window, 'keydown', e =>
      this.handleKeyDown(this.keyToEvent[e.keyCode]),
    )
  }

  keyToEvent = {
    37: 'left',
    39: 'right',
    40: 'down',
    38: 'up',
    13: 'enter',
  }

  handleKeyDown = keyName => {
    if (!keyName) {
      return
    }
    // @ts-ignore
    this.emit('key', keyName)
  }
}
