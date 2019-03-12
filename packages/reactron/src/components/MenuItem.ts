import { MenuItem as ElectronMenuItem } from 'electron'
import { BaseComponent } from './BaseComponent'

export class MenuItem extends BaseComponent {
  menuItem = null

  handleNewProps() {
    // electron doesnt like undefined values
    const { props } = this
    this.handleEvent(this.emitter, 'click', props.onClick)
    let menuItem: any = {}
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
      menuItem.click = (_item, _browserWindow, event) => {
        this.emitter.emit('click', event)
      }
    }
    this.menuItem = new ElectronMenuItem(menuItem)
  }
}
