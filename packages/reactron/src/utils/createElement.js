import * as Components from '../components'

// Stores the root container instance
let ROOT = null

export function getHostContextNode(rootNode) {
  if (typeof rootNode !== undefined) {
    ROOT = rootNode
  } else {
    console.warn(`${rootNode} is not an instance of electron app.`)
    ROOT = new Components.Root()
  }
  return ROOT
}

export function createElement(type, props) {
  const COMPONENTS = {
    ROOT: () => new Components.Root(),
    APP: () => new Components.App(ROOT, props),
    MENU: () => new Components.Menu(ROOT, props),
    MENUITEM: () => new Components.MenuItem(ROOT, props),
    SUBMENU: () => new Components.SubMenu(ROOT, props),
    WINDOW: () => new Components.Window(ROOT, props),
  }

  if (COMPONENTS[type]) {
    const instance = COMPONENTS[type]()
    // instance.applyProps(props)
    return instance
  }

  console.warn('Invalid type given to reactron', type)
}
