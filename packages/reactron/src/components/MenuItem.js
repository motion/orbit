import BaseComponent from './BaseComponent'
import { MenuItem as ElectronMenuItem } from 'electron'
import EventEmitter from 'events'

export default class MenuItem extends BaseComponent {
  mount() {
    this.emitter = new EventEmitter()
  }

  handleNewProps() {
    const { props } = this
    this.handleEvent(this.emitter, 'click', props.onClick)
    if (props.role) {
      this.menuItem = new ElectronMenuItem({
        role: props.role,
      })
    } else {
      this.menuItem = new ElectronMenuItem({
        type: props.type || 'normal',
        label: props.label,
        accelerator: props.accelerator,
        click: (menuItem, browserWindow, event) => {
          this.emitter.emit('click', event)
        },
      })
    }
  }
}
