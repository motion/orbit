import { BaseComponent } from './BaseComponent'
import EventEmitter from 'events'
import { MenuItem as ElectronMenuItem } from 'electron'

export class MenuItem extends BaseComponent {
  mount() {
    this.emitter = new EventEmitter()
    this.update()
  }

  handleNewProps() {
    // electron doesnt like undefined values
    const { props } = this
    this.handleEvent(this.emitter, 'click', props.onClick)
    let menuItem = {}
    if (props.role) {
      menuItem.role = props.role
    } else {
      menuItem = {
        type: props.type || 'normal',
        label: props.label,
      }
    }
    if (props.accelerator) {
      menuItem.accelerator = props.accelerator
    }
    if (props.accelerators) {
      menuItem.accelerators = props.accelerators
    }
    if (props.onClick) {
      menuItem.click = (menuItem, browserWindow, event) => {
        this.emitter.emit('click', event)
      }
    }
    this.menuItem = new ElectronMenuItem(menuItem)
  }
}
