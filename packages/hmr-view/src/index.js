import window from 'global/window'
import { getForceUpdate } from 'react-proxy'

const viewProxies = {}
window.viewProxies = viewProxies

let reloaded = []

function createProxy(Klass) {
  const mountedInstances = new Set()
  let Current = wrap(Klass)
  let Base = Klass

  function wrap(Thing) {
    class Next {
      static get name() {
        return Thing.name
      }
      constructor(...args) {
        const thing = new Thing(...args)
        Object.keys(thing).forEach(key => {
          this[key] = thing[key]
        })
      }
    }
    Object.setPrototypeOf(
      Next.prototype,
      new Proxy(Thing.prototype, {
        get(target, key, receiver) {
          if (key === 'componentDidMount') {
            return function(...args) {
              mountedInstances.add(this)
              return (
                Base.prototype[key] && Base.prototype[key].call(this, ...args)
              )
            }
          }
          if (key === 'componentWillUnmount') {
            return function(...args) {
              mountedInstances.delete(this)
              return (
                Base.prototype[key] && Base.prototype[key].call(this, ...args)
              )
            }
          }
          return Base.prototype[key] || Reflect.get(target, key, receiver)
        },
      })
    )
    Object.keys(Thing).forEach(key => {
      Next[key] = Thing[key]
    })
    return Next
  }

  function update(Thing) {
    Base = Thing
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
    console.log('GOT AN', instance)
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
