import { CurrentComponent, IS_STORE } from '@mcro/automagical'
import { EQUALITY_KEY } from '@mcro/fast-compare'
import { last } from 'lodash'
import { isAction } from 'mobx'

const IS_PROXY = Symbol('IS_PROXY')
export const GET_STORE = Symbol('GET_STORE')

type ProxyWorm<A extends Function> = {
  state: ProxyWormState
  store: A
  track(id: number, debug?: CurrentComponent): () => Set<string>
}

type ProxyWormState = {
  ids: Set<number>
  loops: WeakMap<any, any>
  keys: Map<number, Set<string>>
  add: (s: string) => void
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

export function mobxProxyWorm<A extends Function>(
  obj: A,
  parentPath = '',
  parentState?: ProxyWormState,
): ProxyWorm<A> {
  let debug: CurrentComponent = null
  const state: ProxyWormState = parentState || {
    ids: new Set(),
    loops: new WeakMap(),
    keys: new Map<number, Set<string>>(),
    add: (next: string) => {
      if (state.ids.size === 0) return
      state.keys.get(last([...state.ids])).add(next)
    },
  }

  const store = new Proxy(obj, {
    get(target, key) {
      if (key === GET_STORE) return obj
      if (key === EQUALITY_KEY) return obj
      if (key === IS_PROXY) return true
      const val = Reflect.get(target, key)
      if (state.ids.size === 0) return val // not tracking
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
      if (debug) console.log('get key', key, debug, state.ids)
      if (isFunction) {
        // this will ensure prototypical fns will still move through proxyWorm
        return (...args: any[]) => val.call(store, ...args)
      }
      state.add(nextPath)
      if (val) {
        if (val[IS_PROXY]) return val
        // only POJOs or explicitly trackable things
        if (val.constructor.name === 'Object' || val[IS_STORE]) {
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
    track(id: number, dbg?: CurrentComponent) {
      debug = dbg || null
      if (debug) console.log('track start', id, [...state.ids])
      state.ids.add(id)
      state.keys.set(id, new Set())
      return () => {
        // we may call untrack() then dispose() later so only do once
        if (state.ids.has(id)) {
          state.ids.delete(id)
          const res = state.keys.get(id)
          state.keys.delete(id)
          filterShallowKeys(res)
          if (debug) console.log('track fin', id, [...state.ids], [...state.keys])
          return res
        }
      }
    },
  }
}
