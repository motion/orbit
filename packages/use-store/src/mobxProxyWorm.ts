import { IS_STORE } from '@mcro/automagical'

const IS_PROXY = Symbol('IS_PROXY')

type ProxyWorm<A extends Function> = {
  store: A
  track(): () => Set<string>
}

type ProxyWormState = {
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
    loops: new WeakMap(),
    keys: new Map<number, Set<string>>(),
    add: (next: string) => [...state.keys.values()].forEach(set => set.add(next)),
  }

  const store = new Proxy(obj, {
    get(target, key) {
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
    track() {
      const id = Math.random()
      state.keys.set(id, new Set())
      return () => {
        const res = state.keys.get(id)
        state.keys.delete(id)

        // reduce size for mobx to not do duplicate checks
        let lastKey: string | null = null
        for (const key in res.values()) {
          if (lastKey && key.indexOf(lastKey) === 0) {
            console.log('deleting', lastKey, res)
            res.delete(lastKey)
          }
          console.log('key2', key, res)
          lastKey = key
        }

        return res
      }
    },
  }
}
