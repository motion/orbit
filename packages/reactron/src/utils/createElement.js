import * as Components from '../components'

// Stores the root container instance
let ROOT_NODE_INSTANCE = null

export function getHostContextNode(rootNode) {
  if (typeof rootNode !== undefined) {
    return (ROOT_NODE_INSTANCE = rootNode)
  } else {
    console.warn(`${rootNode} is not an instance of electron app.`)
    // Lazily create the instance (escape hatch if the global state is mutated)
    return (ROOT_NODE_INSTANCE = new Components.Root())
  }
}

export function createElement(type, props) {
  const COMPONENTS = {
    ROOT: () => new Components.Root(),
    MENU: () => new Components.Menu(ROOT_NODE_INSTANCE, props),
    MENUITEM: () => new Components.MenuItem(ROOT_NODE_INSTANCE, props),
    SUBMENUITEM: () => new Components.SubMenuItem(ROOT_NODE_INSTANCE, props),
    WINDOW: () => new Components.Window(ROOT_NODE_INSTANCE, props),
  }

  if (COMPONENTS[type]) {
    return COMPONENTS[type]()
  }

  console.warn('Invalid type given to reactron', type)
}
