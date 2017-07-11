import window from 'global/window'
import { getForceUpdate } from 'react-proxy'

const viewProxies = {}
window.viewProxies = viewProxies

let reloaded = []

function createProxy(Klass) {
  const mountedInstances = new Set()
  let BaseProto = Object.assign({}, Klass.prototype)
  let Current = wrap(Klass)

  function wrap(Thing) {
    const ogMount = BaseProto.componentDidMount
    const ogWillUnmount = BaseProto.componentWillUnmount
    Thing.prototype = new Proxy(Thing.prototype, {
      get(target, method, receiver) {
        if (method === 'constructor') {
          return target[method]
        }
        if (method === 'componentDidMount') {
          return function(...args) {
            mountedInstances.add(this)
            return ogMount && ogMount.call(this, ...args)
          }
        }
        if (method === 'componentWillUnmount') {
          return function(...args) {
            mountedInstances.delete(this)
            return ogWillUnmount && ogWillUnmount.call(this, ...args)
          }
        }
        return BaseProto[method] || Reflect.get(target, method, receiver)
      },
    })
    return Thing
  }

  function update(Thing) {
    BaseProto = Object.assign({}, Thing.prototype)
    const all = []
    mountedInstances.forEach(instance => {
      all.push(instance)
    })
    return all
  }

  return {
    update,
    get: () => Current,
    instances: () => mountedInstances,
  }
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
      'locals[0] does not appear to be a `module` object with Hot Module ' +
        'replacement API enabled. You should disable react-transform-hmr in ' +
        'production by using `env` section in Babel configuration. See the ' +
        'example in README: https://github.com/gaearon/react-transform-hmr'
    )
  }

  const forceUpdater = getForceUpdate(React || window.React)

  const hotReload = instance => {
    forceUpdater(instance)
  }

  return function wrapWithProxy(ReactClass, uniqueId) {
    const { isInFunction = false, displayName = uniqueId } = components[
      uniqueId
    ]
    const uid = filename + '$' + uniqueId

    if (isInFunction) {
      return ReactClass
    }

    module.hot.accept(() => {
      console.log('just accepting', uid)
    })

    // if existing proxy
    if (viewProxies[uid]) {
      reloaded.push(displayName)
      const instances = viewProxies[uid].update(ReactClass)
      log('got instances', instances)
      setTimeout(() => instances.forEach(hotReload))
    } else {
      viewProxies[uid] = createProxy(ReactClass)
    }

    return viewProxies[uid].get()
  }
}

setInterval(() => {
  if (reloaded.length) {
    console.log(`[HMR] views: ${reloaded.join(', ')}`)
    reloaded = []
  }
}, 1000)
