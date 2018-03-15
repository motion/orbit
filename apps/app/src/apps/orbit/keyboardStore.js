import { store } from '@mcro/black'

@store
export default class KeyboardStore {
  constructor() {
    this.on(window, 'keydown', x => this.emit('keydown', x.keyCode))
  }
}
