import { EventEmitter } from 'events'
import { BaseComponent } from './BaseComponent'

export class TrayItem extends BaseComponent {
  trayItem = null
  emitter = new EventEmitter()

  mount() {
    this.update()
  }

  handleClick = (_menuItem, _browserWindow, event) => {
    this.emitter.emit('click', event)
  }

  handleNewProps() {
    const { onClick, ...props } = this.props
    this.handleEvent(this.emitter, 'click', onClick)
    this.trayItem = props
    if (onClick) {
      this.trayItem.click = this.handleClick
    }
  }
}
