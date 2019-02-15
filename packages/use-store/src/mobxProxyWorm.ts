import { IS_STORE } from '@mcro/automagical'
import fastEqual from '@mcro/fast-compare'
import { last } from 'lodash'

const IS_PROXY = Symbol('IS_PROXY')

type ProxyWorm<A extends Function> = {
  store: A
  track(id: number): () => Set<string>
}

console.log(fastEqual.EQUALITY_KEY)

type ProxyWormState = {
  ids: Set<number>
  loops: WeakMap<any, any>
  keys: Map<number, Set<string>>
  add: (s: string) => void
}

export function mobxProxyWorm<A extends Function>(
  obj: A,
  parentPath = '',
  parentState?: ProxyWormState,
): ProxyWorm<A> {
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
      if (key === fastEqual.EQUALITY_KEY) return obj
      if (key === IS_PROXY) return true
      const val = Reflect.get(target, key)
      if (typeof key !== 'string' || key === 'hasOwnProperty' || key[0] === '@') {
        return val
      }
      if (typeof val === 'function') return val
      if (key.indexOf('isMobX') === 0) return val
      const nextPath = `${parentPath ? `${parentPath}.` : ''}${key}`
      state.add(nextPath)
      if (val) {
        if (val[IS_PROXY]) return val
        // only POJOs or explicitly trackable things
        if (val.constructor.name === 'Object' || val[IS_STORE]) {
          // prevent cycles...
          if (state.loops.has(val)) return state.loops.get(val)
          const next = mobxProxyWorm(val, nextPath, state).store
          state.loops.set(val, next)
          return next
        }
      }
      return val
    },
  }) as A

  return {
    store,
    track(id: number) {
      state.ids.add(id)
      state.keys.set(id, new Set())
      return () => {
        state.ids.delete(id)
        const res = state.keys.get(id)
        state.keys.delete(id)

        // reduce size for mobx to not do duplicate checks
        let lastKey: string | null = null
        for (const key of [...res]) {
          if (lastKey && key.indexOf(lastKey) === 0) {
            res.delete(lastKey)
          }
          lastKey = key
        }

        return res
      }
    },
  }
}
