import { Menu as ElectronMenu } from 'electron'
import { BaseComponent } from './BaseComponent'

export class Menu extends BaseComponent {
  mount() {
    this.update()
  }

  handleNewProps() {
    this.menu = new ElectronMenu()
    for (const child of this.children) {
      if (child.menuItem) {
        this.menu.append(child.menuItem)
      }
    }
    ElectronMenu.setApplicationMenu(this.menu)
  }
}
