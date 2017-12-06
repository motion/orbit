import { Menu } from 'electron'
import BaseComponent from './BaseComponent'

export default class MenuElement extends BaseComponent {
  mount() {
    this.update()
  }

  handleNewProps() {
    this.menu = new Menu()
    for (const child of this.children) {
      if (child.menuItem) {
        this.menu.append(child.menuItem)
      }
    }
    Menu.setApplicationMenu(this.menu)
  }
}
