// @flow
import { Menu } from 'electron'
import BaseComponent from './BaseComponent'
// import SubMenuItem from './SubMenuItem'

// function commitApplicationMenu(menu: Menu, menuElements: Array<BaseElement>) {
//   for (const el of menuElements) {
//     if (el instanceof SubmenuElement) {
//       if (el.menuItem) {
//         menu.append(el.menuItem)
//       }
//     }
//   }
//   Menu.setApplicationMenu(menu)
// }

export default class MenuElement extends BaseComponent {
  handleNewProps(keys) {
    this.menu = new Menu()
    console.log('this.props.children', this.props.children)
    // for (const child of this.props.children) {
    //   console.log(child)
    // }
  }

  render() {
    console.log('rendering', this.props.children)
    // Menu.setApplicationMenu(this.props.children)
  }
}
