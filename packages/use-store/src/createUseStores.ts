import { useCurrentComponent } from '@o/automagical'
import { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { setupTrackableStore } from './setupTrackableStore'
import { useForceUpdate } from './useStore'

// for use in children
// tracks every store used and updates if necessary

export type UseStoresOptions<A> = { optional?: (keyof A)[]; debug?: boolean }

export function createUseStores<A extends Object>(StoreContext: React.Context<A>) {
  return function useStores(options?: UseStoresOptions<A>): A {
    const stores = useContext(StoreContext)
    const stateRef = useRef(new Map<any, ReturnType<typeof setupTrackableStore>>())
    const render = useForceUpdate()
    const component = useCurrentComponent()
    const storesRef = useRef(null)

    useEffect(() => {
      return () => {
        for (const { dispose } of stateRef.current.values()) {
          dispose()
        }
      }
    }, [])

    const state = stateRef.current

    if (!storesRef.current) {
      // this will throw if they try and access a store thats not provided
      // should give us runtime safety without as much type overhead everywhere
      storesRef.current = new Proxy(stores, {
        get(target, key) {
          const store = Reflect.get(target, key)
          // found a store, wrap it for tracking
          if (typeof store !== 'undefined') {
            // wrap each store with trackable
            if (state.has(store)) {
              return state.get(store).store
            }
            const next =
              process.env.NODE_ENV === 'development'
                ? setupTrackableStore(store, render, {
                    ...options,
                    component,
                  })
                : setupTrackableStore(store, render)
            // track immediately because it will be missed by track block below
            next.track()
            state.set(store, next)
            return next.store
          }
          // check if didn't find a store!
          if (typeof key === 'string') {
            if (options && options.optional && options.optional.find(x => x === key)) {
              return
            }
            if (key.indexOf('isMobX') === 0 || key.indexOf('_') === 0) {
              return
            }
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Attempted to get store ${String(key)} which is not in context`)
            }
          }
        },
      })
    }

    // track and untrack
    for (const { track } of state.values()) {
      track()
    }
    useLayoutEffect(() => {
      for (const { untrack } of state.values()) {
        untrack()
      }
    })

    return storesRef.current
  }
}
