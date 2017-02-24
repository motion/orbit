export { view, glossy } from './view'
export { store } from './store'
export { observable } from 'mobx'

export const id = _ => _

// getter cache
// first time it callsback and fetches
// else return cached value
export function lazyObject(object, onGet = id) {
  const newObject = {}
  const loaded = {}
  for (const name of Object.keys(object)) {
    Object.defineProperty(newObject, name, {
      get: function() {
        if (loaded[name]) {
          return loaded[name]
        }
        const value = onGet(object[name])
        loaded[name] = value
        return value
      }
    })
  }
  return newObject
}
