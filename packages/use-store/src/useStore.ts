import { CurrentComponent, decorate, updateProps, useCurrentComponent } from '@mcro/automagical'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { config } from './configure'
import { debugEmit } from './debugUseStore'
import { setupTrackableStore, useTrackableStore } from './setupTrackableStore'

export { IS_STORE } from '@mcro/automagical'
export { configureUseStore } from './configure'
export { debugUseStore } from './debugUseStore'

type UseStoreOptions = {
  debug?: boolean
  conditionalUse?: boolean
  react?: boolean
}

export function disposeStore(store: any, component: CurrentComponent) {
  store.unmounted = true
  store.willUnmount && store.willUnmount()
  if (process.env.NODE_ENV === 'development') {
    debugEmit({
      type: 'unmount',
      store,
      component,
    })
  }
  store.dispose()
}

let currentHooks = null

export function useHook<A extends ((...args: any[]) => any)>(cb: A): ReturnType<A> {
  currentHooks = currentHooks || []
  currentHooks.push(cb)
  return cb()
}

function setupReactiveStore<A>(Store: new () => A, props?: Object) {
  const component = useCurrentComponent()
  const AutomagicStore = decorate(Store, props)

  // capture hooks for this store, must be before new AutomagicStore()
  currentHooks = null
  const store = new AutomagicStore()

  if (config.onMount) {
    config.onMount(store)
  }

  if (process.env.NODE_ENV === 'development') {
    debugEmit({
      type: 'mount',
      store,
      component,
    })
  }

  return {
    store,
    hooks: currentHooks,
    hasProps: !!props,
  }
}

function useReactiveStore<A extends any>(Store: new () => A, props?: any): A {
  const forceUpdate = useForceUpdate()
  const state = useRef({
    store: null,
    hooks: null,
    hasProps: null,
  })
  let store = state.current.store
  const hasChangedSource = store && !isSourceEqual(store, Store)

  if (!store || hasChangedSource) {
    state.current = setupReactiveStore(Store, props)
  } else {
    // ensure we dont have different number of hooks by re-running them
    if (state.current.hooks) {
      // TODO this wont actually update them :/
      for (const hook of state.current.hooks) {
        hook()
      }
    }
  }

  // update props after first run
  if (props && !!store) {
    updateProps(store, props)
  }

  if (hasChangedSource) {
    console.log('HMR store', Store.name)
    forceUpdate()
  }

  return state.current.store
}

// allows us to use instantiated or non-instantiated stores
// sets up tracking so the component auto re-renders
export function useStore<P, A extends { props?: P } | any>(
  Store: (new () => A) | A,
  props?: P,
  options?: UseStoreOptions,
): A {
  const component = useCurrentComponent()
  const rerender = useForceUpdate()
  const isInstantiated = Store['constructor'].name !== 'Function'
  let store = null

  if (isInstantiated) {
    store = (Store as unknown) as A
    store = useTrackableStore(store, rerender, { ...options, component })
  } else {
    store = Store as new () => A
    store = useReactiveStore(store, props)
    if (!options || options.react !== false) {
      store = useTrackableStore(store, rerender, { ...options, component })
    }
    useEffect(() => {
      if (!isInstantiated) {
        store.didMount && store.didMount()
      }
      return () => disposeStore(store, component)
    }, [])
  }

  if (options && options.conditionalUse === false) {
    return null
  }

  return store
}

// no tracking
export function useStoreSimple<P, A extends { props?: P } | any>(
  Store: new () => A,
  props?: P,
  options?: UseStoreOptions,
): A {
  return useStore(Store, props, { ...options, react: false })
}

function isSourceEqual(oldStore: any, newStore: new () => any) {
  return oldStore.constructor.toString() === newStore.toString()
}

export function useStoreDebug() {
  const component = useCurrentComponent()
  component.__debug = true
  // use setTimeout so we dont use hooks
  // this is so we can HMR it nicely without hooks complaining
  setTimeout(() => {
    component.__debug = false
  }, 1000)
}

export function useForceUpdate() {
  const setState = useState(0)[1]
  return useCallback(() => {
    setState(Math.random())
  }, [])
}

// for use in children
// tracks every store used and updates if necessary

export function createUseStores<A extends Object>(StoreContext: React.Context<A>) {
  return function useStores(options?: { optional?: (keyof A)[]; debug?: boolean }): A {
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
