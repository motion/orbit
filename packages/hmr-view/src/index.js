import createProxy from './proxyClass'
import deepForceUpdate from 'react-deep-force-update'

let viewProxies = {}
let reloaded = []
let reloadedInstances = 0
let lastHotReload = Date.now()

if (module && module.hot && module.hot.accept) {
  module.hot.accept(() => {
    viewProxies = module.hot.data.viewProxies || {}
  })
  module.hot.dispose(data => {
    data.viewProxies = viewProxies
  })
}

export default function proxyReactComponents({
  filename,
  components,
  imports,
  locals,
}) {
  const [React] = imports
  const [module] = locals
  const [{ hot }] = locals

  if (!hot || typeof hot.accept !== 'function') {
    throw new Error(
      'locals[0] does not appear to be a `module` object with Hot Module replacement API enabled. You should disable @mcro/view-hmr',
    )
  }

  const doHotReload = instance => {
    if (instance.hotReload) {
      instance.hotReload(module)
    }
    deepForceUpdate(instance)
    if (instance.forceUpdate) {
      instance.forceUpdate()
    }
    reloadedInstances++
  }

  return function wrapWithProxy(ReactClass, uid) {
    const { isInFunction, displayName = uid } = components[uid]
    const path = filename + '$' + uid

    if (isInFunction) {
      return ReactClass
    }

    if (module && module.hot && module.hot.accept) {
      module.hot.accept(() => {}) // to make it a fast hmr
    }

    // if existing proxy
    if (viewProxies[path]) {
      reloaded.push(displayName)
      const instances = viewProxies[path].update(ReactClass)
      setTimeout(() => {
        instances.forEach(doHotReload)
        lastHotReload = Date.now()
        window.lastHotReload = lastHotReload
      })
    } else {
      viewProxies[path] = createProxy(ReactClass)
    }

    const view = viewProxies[path].get()

    view.__react_path = path

    return viewProxies[path].get()
  }
}

setInterval(() => {
  if (reloaded.length) {
    console.log(`[HMR] ${reloaded.join(', ')}, ${reloadedInstances} instances`)
    if (window.Black) {
      window.Black.view.emit('hmr')
    }
    reloaded = []
    reloadedInstances = 0
  }
}, 1000)
