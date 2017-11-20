import { Menu } from 'electron'
import BaseComponent from './BaseComponent'

export default class MenuElement extends BaseComponent {
  handleNewProps() {
    this.menu = new Menu()

    for (const child of this.children) {
      console.log('chidlren', child)
      if (child.menuItem) {
        this.menu.append(child.menuItem)
      }
    }

    Menu.setApplicationMenu(this.menu)
  }
}
