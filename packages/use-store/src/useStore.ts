import { decorate, updateProps } from '@mcro/automagical'
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  // @ts-ignore
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from 'react'
import { config } from './configure'
import { DebugComponent, debugEmit } from './debugUseStore'
import { setupTrackableStore, useTrackableStore } from './setupTrackableStore'

export { configureUseStore } from './configure'
export { debugUseStore } from './debugUseStore'

const { ReactCurrentOwner } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

type UseStoreOptions = {
  debug?: boolean
  conditionalUse?: boolean
  react?: boolean
}

export function disposeStore(store: any, component: DebugComponent) {
  store.unmounted = true
  store.willUnmount && store.willUnmount()
  if (process.env.NODE_ENV === 'development') {
    debugEmit({
      type: 'unmount',
      store,
      component,
    })
  }
  store.disposeAutomagic()
}

let currentHooks = null

export function useHook<A extends ((...args: any[]) => any)>(cb: A): ReturnType<A> {
  currentHooks = currentHooks || []
  currentHooks.push(cb)
  return cb()
}

function setupReactiveStore<A>(Store: new () => A, props?: Object) {
  const component = getCurrentComponent()
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
  const component = getCurrentComponent()
  const rerender = useForceUpdate()
  const isInstantiated = Store['constructor'].name !== 'Function'
  let store = null

  if (isInstantiated) {
    store = (Store as unknown) as A
    store = useTrackableStore(store, rerender)
  } else {
    store = Store as new () => A
    store = useReactiveStore(store, props)
    if (!options || options.react !== false) {
      store = useTrackableStore(store, rerender)
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
  const component = getCurrentComponent()
  component.__debug = true
  // use setTimeout so we dont use hooks
  // this is so we can HMR it nicely without hooks complaining
  setTimeout(() => {
    component.__debug = false
  }, 1000)
}

export function getCurrentComponent(): DebugComponent {
  const component =
    ReactCurrentOwner && ReactCurrentOwner.current && ReactCurrentOwner.current.elementType
      ? ReactCurrentOwner.current.elementType
      : {}
  component['renderName'] = component['renderName'] || getComponentName(component)
  return component
}

function getComponentName(c) {
  let name = c.displayName || (c.type && c.type.displayName) || (c.render && c.render.name)
  if (c.displayName === '_default') {
    name = c.type && c.type.displayName
  }
  if (name === 'Component' || name === '_default' || !name) {
    if (c.type && c.type.__reactstandin__key) {
      const match = c.type.__reactstandin__key.match(/\#[a-zA-Z0-9_-]+/g)
      if (match && match.length) {
        name = match[0].slice(1)
      }
    }
  }
  if (name === '_default') {
    debugger
  }
  return name
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
    const component = getCurrentComponent()
    const storesRef = useRef(null)

    // debounce all the different store renders
    let tm = null
    const rerender = () => {
      clearImmediate(tm)
      tm = setImmediate(render)
    }

    useEffect(() => {
      return () => {
        clearImmediate(tm)
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
                ? setupTrackableStore(store, rerender, {
                    ...options,
                    component,
                  })
                : setupTrackableStore(store, rerender)

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
