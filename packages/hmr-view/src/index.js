import createProxy from './proxyClass'
import deepForceUpdate from 'react-deep-force-update'

let viewProxies = {}
let reloaded = []
let reloadedInstances = 0

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
      'locals[0] does not appear to be a `module` object with Hot Module replacement API enabled. You should disable @mcro/view-hmr'
    )
  }

  const doHotReload = instance => {
    if (instance.hotReload) {
      instance.hotReload(module)
    }
    deepForceUpdate(instance)
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
        // Black.view.emit('hmr')
      })
    } else {
      viewProxies[path] = createProxy(ReactClass)
    }

    return viewProxies[path].get()
  }
}

setInterval(() => {
  if (reloaded.length) {
    console.log(
      `[HMR] views: ${reloaded.join(', ')}, ${reloadedInstances} instances`
    )
    reloaded = []
    reloadedInstances = 0
  }
}, 1000)
