import BaseComponent from './BaseComponent'
import { Menu, MenuItem } from 'electron'

export default class SubMenu extends BaseComponent {
  mount() {
    this.update()
  }

  handleNewProps() {
    const { props } = this
    const submenu = new Menu()

    for (const child of this.children) {
      if (child.menuItem) {
        submenu.append(child.menuItem)
      }
    }

    this.menuItem = new MenuItem({
      label: props.label,
      submenu,
    })
  }
}
