import { IS_STORE } from '@o/automagical'
import { EQUALITY_KEY } from '@o/fast-compare'
import { isAction, isObservableObject } from 'mobx'

const IS_PROXY = Symbol('IS_PROXY')
export const GET_STORE = Symbol('GET_STORE')

type ProxyWorm<A extends Function> = {
  state: ProxyWormState
  store: A
  track(debug?: boolean): () => Set<string>
}

type ProxyWormState = {
  ids: Set<number>
  loops: WeakMap<any, any>
  keys: Map<number, Set<string>>
  add: (s: string) => void
  activeId: number
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

let id = 0
const nextId = () => {
  id = (id + 1) % Number.MAX_SAFE_INTEGER
  return id
}

export function mobxProxyWorm<A extends Function>(
  obj: A,
  parentPath = '',
  parentState?: ProxyWormState,
): ProxyWorm<A> {
  const state: ProxyWormState = parentState || {
    debug: false,
    activeId: -1,
    ids: new Set(),
    loops: new WeakMap(),
    keys: new Map<number, Set<string>>(),
    add: (next: string) => {
      if (state.activeId !== -1) {
        if (state.debug) console.log('add key', next, state.activeId)
        state.keys.get(state.activeId).add(next)
      }
    },
  }

  const store = new Proxy(obj, {
    get(target, key) {
      if (key === GET_STORE) return obj
      if (key === EQUALITY_KEY) return obj
      if (key === IS_PROXY) return true
      const val = Reflect.get(target, key)
      if (state.ids.size === 0) return val
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
      if (isFunction && isAction(val)) return val
      if (key.indexOf('isMobX') === 0) return val
      if (key[0] === '_') return val
      const nextPath = `${parentPath ? `${parentPath}.` : ''}${key}`
      if (isFunction) {
        // this will ensure prototypical fns will still move through proxyWorm
        // by binding store to val, so they use the proxy worm as `this`
        return (...args: any[]) => val.call(store, ...args)
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
      const id = nextId()
      state.debug = dbg || false
      // if (state.debug) console.log('track start', id, [...state.ids])
      state.activeId = id
      state.ids.add(id)
      state.keys.set(id, new Set())
      return () => {
        // we may call untrack() then dispose() later so only do once
        if (state.ids.has(id)) {
          state.activeId = -1
          state.ids.delete(id)
          const res = state.keys.get(id)
          state.keys.delete(id)
          // if (state.debug) console.log('track fin', id, [...res], [...state.ids])
          filterShallowKeys(res)
          return res
        }
      }
    },
  }
}
