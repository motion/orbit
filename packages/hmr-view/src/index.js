import window from 'global/window'
import { getForceUpdate } from 'react-proxy'

const viewProxies = {}
window.viewProxies = viewProxies

let reloaded = []

function createProxy(Klass) {
  const mountedInstances = new WeakMap()
  let Current

  update(Klass)

  function update(Thing) {
    // wrap
    Current = class X {
      static get name() {
        return Thing.name
      }
    }

    Object.keys(Thing).forEach(key => {
      Current[key] = Thing[key]
    })

    const thingProto = Thing.prototype
    Current.prototype = new Proxy(thingProto, {
      get(target, name) {
        console.log('gets', name)
        if (name === 'componentDidMount') {
          log('wrapping mount')
          mountedInstances[target] = target
        }
        if (name === 'componentWillUnmount') {
          delete mountedInstances[target]
        }
        return typeof target[name] === 'function'
          ? target[name].bind(target)
          : target[name]
      },
    })

    // update
    return Object.keys(mountedInstances).map(k => {
      mountedInstances[k] = Current
      return mountedInstances[k]
    })
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

  return function wrapWithProxy(ReactClass, uniqueId) {
    const { isInFunction = false, displayName = uniqueId } = components[
      uniqueId
    ]
    const uid = filename + '$' + uniqueId
    log('HMR', uid)

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
      setTimeout(() =>
        instances.forEach(instance => {
          log('HANDLE HMR', instance)
          if (instance.handleHotReload) {
            instance.handleHotReload(module, forceUpdater(instance))
          }
        })
      )
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
