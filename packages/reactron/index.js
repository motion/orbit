// helpers for Menu.Separator, Menu.About, etc...
import * as MenuItems_ from './components/MenuItemExtra'
export const MenuItems = MenuItems_
export * from './renderer/render'
export const App = 'APP'
export const Window = 'WINDOW'
export const Tray = 'TRAY'
export const Menu = 'MENU'
export const MenuItem = 'MENUITEM'
export const SubMenu = 'SUBMENU'
export const Text = 'TEXT'

import {
  EMBER_INSPECTOR,
  REACT_DEVELOPER_TOOLS,
  BACKBONE_DEBUGGER,
  JQUERY_DEBUGGER,
  ANGULARJS_BATARANG,
  VUEJS_DEVTOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
  CYCLEJS_DEVTOOL,
  MOBX_DEVTOOLS,
  APOLLO_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'

export const DevTools = {
  ember: EMBER_INSPECTOR,
  vuejs: VUEJS_DEVTOOLS,
  redux: REDUX_DEVTOOLS,
  react: REACT_DEVELOPER_TOOLS,
  mobx: MOBX_DEVTOOLS,
  apollo: APOLLO_DEVELOPER_TOOLS,
  cycle: CYCLEJS_DEVTOOL,
  reactPerf: REACT_PERF,
  jquery: JQUERY_DEBUGGER,
  backbone: BACKBONE_DEBUGGER,
  angular: ANGULARJS_BATARANG,
}
