import { IS_STORE } from '@o/automagical'
import { EQUALITY_KEY } from '@o/fast-compare'
import { isObservableObject, isObservableProp } from 'mobx'

const IS_PROXY = Symbol('IS_PROXY')
export const GET_STORE = Symbol('GET_STORE')

export type ProxyWorm<A extends Function> = {
  state: ProxyWormState
  store: A
  track(debug?: boolean): () => Set<string>
}

type ProxyWormState = {
  ids: Set<number>
  loops: WeakMap<any, any>
  keys: Map<number, Set<string>>
  add: (s: string) => void
  current: number | any
  debug: boolean
}

const filterShallowKeys = (set: Set<string>) => {
  // reduce size for mobx to not do duplicate checks
  let lastKey: string | null = null
  for (const key of [...set]) {
    if (lastKey && key.indexOf(lastKey) === 0) {
      set.delete(lastKey)
    }
    lastKey = key
  }
  return set
}

const emptySet = new Set<string>()

// helpful for passing down context
let resetTrack = new Set<Function>()
export function resetTracking() {
  ;[...resetTrack].map(x => x())
}

// short ids for debug mode
let uid = 0
const getUID = () => {
  uid = (uid + 1) % Number.MAX_SAFE_INTEGER
  return uid
}

const WrappedFns = new WeakMap()

export function mobxProxyWorm<A extends Function>(
  obj: A,
  parentPath = '',
  parentState?: ProxyWormState,
): ProxyWorm<A> {
  const state: ProxyWormState = parentState || {
    debug: false,
    current: -1,
    ids: new Set<number>(),
    loops: new WeakMap(),
    keys: new Map<any, Set<string>>(),
    add: (next: string) => {
      if (state.current !== -1) {
        // if (state.debug) console.log('add key', next)
        const curState = state.keys.get(state.current)
        if (curState) {
          curState.add(next)
        }
      }
    },
  }

  resetTrack.add(() => {
    state.current = -1
  })

  const store = new Proxy(obj, {
    get(target, key) {
      if (key === GET_STORE) return obj
      if (key === EQUALITY_KEY) return obj
      if (key === IS_PROXY) return true
      const val = Reflect.get(target, key)
      if (key === 'constructor') return val
      if (
        typeof key !== 'string' ||
        key === 'hasOwnProperty' ||
        key[0] === '@' ||
        key === 'dispose'
      ) {
        return val
      }
      const isFunction = typeof val === 'function'
      if (key.indexOf('isMobX') === 0) return val
      if (key[0] === '_') return val
      const nextPath = `${parentPath ? `${parentPath}.` : ''}${key}`
      if (isFunction) {
        // dont wrap if its an observable value of a function
        if (isObservableProp(store, key)) {
          return val
        }
        if (WrappedFns.has(val)) {
          return WrappedFns.get(val)
        }
        // this will ensure prototypical fns will still move through proxyWorm
        // by binding store to val, so they use the proxy worm as `this`
        const next = (...args: any[]) => val.call(store, ...args)
        // dont re-wrap it every time
        WrappedFns.set(val, next)
        return next
      }
      state.add(nextPath)
      if (val) {
        if (val[IS_PROXY]) return val
        // only drill into explicitly trackable things
        // to be more permissive you could just check if val.constructor.name === 'Object'
        if (isObservableObject(val) || val[IS_STORE]) {
          // prevent cycles...
          if (state.loops.has(val)) {
            return state.loops.get(val)
          }
          // nested tracking for deep observables
          const next = mobxProxyWorm(val, nextPath, state).store
          state.loops.set(val, next)
          return next
        }
      }
      return val
    },
  })

  return {
    state,
    store,
    track(dbg?: boolean) {
      const id = getUID()
      state.current = id
      state.debug = dbg || false
      state.ids.add(id)
      state.keys.set(id, new Set<string>())
      return () => {
        // we may call untrack() then dispose() later so only do once
        if (state.ids.has(id)) {
          state.current = -1
          state.ids.delete(id)
          const res = state.keys.get(id)
          state.keys.delete(id)
          if (res) {
            filterShallowKeys(res)
            return res
          }
        }
        return emptySet
      }
    },
  }
}
