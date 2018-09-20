import { BaseComponent } from './BaseComponent'
import { EventEmitter } from 'events'

export class TrayItem extends BaseComponent {
  trayItem = null

  mount() {
    this.emitter = new EventEmitter()
    this.update()
  }

  handleClick = (menuItem, browserWindow, event) => {
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
