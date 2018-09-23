import { App } from './App'
import { Desktop } from './Desktop'

const listeners = new Map()

App.onMessage(App.messages.PROXY_FN_RESPONSE, val => {
  const data = JSON.parse(val)
  const listener = listeners.get(data.id)
  listeners.delete(data.id)
  listener(data)
})

function decorateMethod(Store, property) {
  Store[property] = function(...args) {
    const id = Math.random()
    App.sendMessage(
      Desktop,
      Desktop.messages.PROXY_FN,
      JSON.stringify({ id, class: Store.constructor.name, property, args }),
    )
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
