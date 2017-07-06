import { getForceUpdate, createProxy } from 'react-proxy'
import window from 'global/window'

let componentProxies
if (window.__reactComponentProxies) {
  componentProxies = window.__reactComponentProxies
} else {
  componentProxies = {}
  Object.defineProperty(window, '__reactComponentProxies', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: componentProxies,
  })
}

let reloaded = []

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
      'locals[0] does not appear to be a `module` object with Hot Module ' +
        'replacement API enabled. You should disable react-transform-hmr in ' +
        'production by using `env` section in Babel configuration. See the ' +
        'example in README: https://github.com/gaearon/react-transform-hmr'
    )
  }

  // module

  if (Object.keys(components).some(key => !components[key].isInFunction)) {
    hot.accept(err => {
      if (err) {
        console.warn(
          `[React Transform HMR] There was an error updating ${filename}:`
        )
        console.error(err)
      }
    })
  }

  const forceUpdater = getForceUpdate(window.React)
  const forceUpdate = instance => {
    instance.handleHotReload && instance.handleHotReload(module)
    return forceUpdater(instance)
  }
  window.forceUpdate = forceUpdate

  return function wrapWithProxy(ReactClass, uniqueId) {
    const { isInFunction = false, displayName = uniqueId } = components[
      uniqueId
    ]

    // attach module to class so it can do shit w it
    // ReactClass.module = module

    if (isInFunction) {
      return ReactClass
    }

    const globalUniqueId = filename + '$' + uniqueId
    if (componentProxies[globalUniqueId]) {
      reloaded.push(displayName)
      const instances = componentProxies[globalUniqueId].update(ReactClass)
      setTimeout(() => instances.forEach(forceUpdate))
    } else {
      componentProxies[globalUniqueId] = createProxy(ReactClass)
    }

    return componentProxies[globalUniqueId].get()
  }
}

setInterval(() => {
  if (reloaded.length) {
    console.log(`[HMR] views: ${reloaded.join(', ')}`)
    reloaded = []
  }
}, 1000)
