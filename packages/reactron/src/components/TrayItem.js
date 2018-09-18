import { BaseComponent } from './BaseComponent'
import { EventEmitter } from 'events'

export class TrayItem extends BaseComponent {
  trayItem = null

  mount() {
    this.emitter = new EventEmitter()
    this.update()
  }

  handleNewProps() {
    const { onClick, ...props } = this.props
    this.handleEvent(this.emitter, 'click', onClick)
    this.trayItem = {
      ...props,
      click: (menuItem, browserWindow, event) => {
        this.emitter.emit('click', event)
      },
    }
  }
}
