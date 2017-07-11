import window from 'global/window'
import createProxy from './proxyClass'
import { getForceUpdate } from 'react-proxy'

let viewProxies = {}
let reloaded = []
let reloadedInstances = []

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

  const forceUpdater = getForceUpdate(React || window.React)

  const hotReload = instance => {
    forceUpdater(instance)
    reloadedInstances.push(1)
  }

  return function wrapWithProxy(ReactClass, uid) {
    const { isInFunction, displayName = uid } = components[uid]
    const path = filename + '$' + uid

    if (isInFunction) {
      return ReactClass
    }

    module.hot.accept(() => {
      console.log('accepted', path)
    }) // to make it a fast hmr

    // if existing proxy
    if (viewProxies[path]) {
      reloaded.push(displayName)
      const instances = viewProxies[path].update(ReactClass)
      setTimeout(() => instances.forEach(hotReload))
    } else {
      viewProxies[path] = createProxy(ReactClass)
    }

    return viewProxies[path].get()
  }
}

setInterval(() => {
  if (reloaded.length) {
    console.log(
      `[HMR] views: ${reloaded.join(
        ', '
      )}, ${reloadedInstances.length} instances`
    )
    reloaded = []
    reloadedInstances = []
  }
}, 1000)
