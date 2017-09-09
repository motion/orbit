// @flow
import objectPath from 'object-path'

// TODO make mobx-able
const action = (id, fn) => fn

export type CursorPath = String | Array<string>
export type Cursor = {
  get: Function,
  set: Function,
  toggle: Function,
  clear: Function,
  setter: Function,
  increment(x: number): () => undefined,
}

function firstSegment(path: CursorPath): string {
  if (Array.isArray(path)) {
    return path[0]
  }
  return path.split('.')[0]
}

const Cache = {}

// like a cursor
// give it a reference to an object path
// it gives you helpers for get/set/...
// also works nicely with mobx
export default function ref(path: CursorPath): Cursor {
  // Cache
  // by returning same function, prevent react from deoptimizing renders that use this
  // because it can track the function as being stable over time
  // also this should have minimal overhead memory wise because refs are small
  // TODO see if weakmap works here
  // TODO add subscription to remove afer unmount
  let cacheKey
  if (this) {
    this.__refUid = this.__refUid || Math.random()
    cacheKey = `${this.__refUid}${path}`
    if (Cache[cacheKey]) {
      return Cache[cacheKey]
    }
  }

  const key = firstSegment(path)

  const get = () => {
    this[key] // trigger mobx watch
    return objectPath.get(this, path)
  }

  const set = action(`ref.set ${path.toString()}`, value => {
    objectPath.set(this, path, value)
    const val = this[key]

    // fix mobx not updating
    if (val && val.constructor === Object) {
      this[key] = Object.assign({}, val)
    } else if (val && val.constructor === Array) {
      this[key] = [].concat(val)
    } else {
      this[key] = val
    }
  })

  const increment = (val = 1) => () => set(get() + val)
  const setter = (...args) => () => set(...args)
  const toggle = () => set(!get())
  const clear = () => set(null)

  const res = { get, set, toggle, clear, setter, increment }

  if (this) {
    Cache[cacheKey] = res
  }

  return res
}
