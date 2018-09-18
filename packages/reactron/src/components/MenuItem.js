import { BaseComponent } from './BaseComponent'
import { MenuItem as ElectronMenuItem } from 'electron'
import EventEmitter from 'events'

export class MenuItem extends BaseComponent {
  mount() {
    this.emitter = new EventEmitter()
    this.update()
  }

  handleNewProps() {
    const { props } = this
    this.handleEvent(this.emitter, 'click', props.onClick)
    if (props.role) {
      this.menuItem = new ElectronMenuItem({
        role: props.role,
        accelerator: props.accelerator,
        accelerators: props.accelerators,
        click: (menuItem, browserWindow, event) => {
          this.emitter.emit('click', event)
        },
      })
    } else {
      this.menuItem = new ElectronMenuItem({
        type: props.type || 'normal',
        label: props.label,
        accelerator: props.accelerator,
        accelerators: props.accelerators,
        click: (menuItem, browserWindow, event) => {
          this.emitter.emit('click', event)
        },
      })
    }
  }
}
