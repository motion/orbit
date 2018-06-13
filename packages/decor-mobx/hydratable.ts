import * as Mobx from 'mobx'

const defaultFilter = (obj, key, val) => {
  if (typeof val === 'function') {
    return true
  }
  if (key.indexOf('_') === 0) {
    return true
  }
  if (Mobx.isComputedProp(obj, key)) {
    return true
  }
  if (Mobx.isAction(val)) {
    return true
  }
  const descriptor = Object.getOwnPropertyDescriptor(obj, key)
  if (descriptor.writable === false || (descriptor.get && !descriptor.set)) {
    return true
  }
}

export function hydratable() {
  return {
    name: 'hydratable',
    once: true,
    onlyClass: true,
    decorator: (Klass, { filter = defaultFilter } = {}) => {
      Klass.prototype.hydrate = function hydrate(state) {
        for (const key of Object.keys(state)) {
          // changed to computed, ignore
          if (Mobx.isComputedProp(this, key)) {
            continue
          }
          this[key] = state[key]
        }
      }

      Klass.prototype.dehydrate = function dehydrate() {
        let state = {}
        for (const key of Object.keys(this)) {
          if (filter(this, key, this[key])) {
            continue
          }
          state[key] = this[key]
        }
        return state
      }
    },
  }
}
