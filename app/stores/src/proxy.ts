
const listeners = new Map()

function decorateMethod(Store, property) {
  Store[property] = function() {
    const id = Math.random()
    return new Promise(res => {
      listeners.set(id, data => res(data))
    })
  }
}

export function proxy<T extends { new (...args: any[]): {} }>(Store: T): T {
  const ProxyStore = function(...args) {
    const store = new Store(...args)
    for (const key in store) {
      decorateMethod(store, key)
    }
    return store
  }
  // copy statics
  const statics = Object.keys(Store)
  if (statics.length) {
    for (const key of statics) {
      ProxyStore[key] = Store[key]
    }
  }
  // workaround my lack of type skills
  return (ProxyStore as unknown) as T
}
