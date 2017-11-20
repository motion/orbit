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
    this.menuItem = new ElectronMenuItem({
      type: 'normal',
      label: props.label,
      accelerator: props.accelerator,
      click: (menuItem, browserWindow, event) => {
        this.emitter.emit('click', event)
      },
    })
  }
}
