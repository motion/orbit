import { Menu, MenuItem } from 'electron'
import { BaseComponent } from './BaseComponent'

export class SubMenu extends BaseComponent {
  menuItem = null

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
