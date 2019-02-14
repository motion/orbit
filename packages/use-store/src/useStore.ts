import { decorate, updateProps } from '@mcro/automagical'
import { throttle } from 'lodash'
import {
  createContext,
  // isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  // @ts-ignore
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from 'react'
import { debugEmit } from './debugUseStore'
import { setupTrackableStore, useTrackableStore } from './setupTrackableStore'

export { debugUseStore } from './debugUseStore'

const { ReactCurrentOwner } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

type UseGlobalStoreOptions = {
  onMount: (store: any) => void
  onUnmount: (store: any) => void
  context?: React.Context<any>
}

type UseStoreOptions = {
  debug?: boolean
  conditionalUse?: boolean
  react?: boolean
}

let config = {
  onMount: null,
  onUnmount: null,
  context: createContext(null),
}

export function disposeStore(store: any) {
  store.unmounted = true
  store.willUnmount && store.willUnmount()
  if (process.env.NODE_ENV === 'development') {
    debugEmit({
      type: 'unmount',
      store,
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
  // automagic store
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
    })
  }

  return {
    store,
    hooks: currentHooks,
    hasProps: !!props,
  }
}

function useReactiveStore<A extends any>(Store: new () => A, props?: any): A {
  const state = useRef({
    store: null,
    hooks: null,
    hasProps: null,
  })
  let store = state.current.store
  const hasChangedSource = store && !isSourceEqual(store, Store)
  const forceUpdate = useThrottledForceUpdate()

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

  store = state.current.store

  // update props after first run
  if (props && !!store) {
    updateProps(store, props)
  }

  if (hasChangedSource) {
    console.log('HMR store', Store.name)
    forceUpdate()
  }

  return store
}

export function useStore<P, A extends { props?: P } | any>(
  Store: new () => A,
  props?: P,
  options?: UseStoreOptions,
): A {
  let store = useReactiveStore(Store, props)
  const rerender = useThrottledForceUpdate()
  const component = getCurrentComponent()
  const componentId = useRef(++nextId)

  if (!options || options.react !== false) {
    if (process.env.NODE_ENV === 'development') {
      store = useTrackableStore(
        store,
        () => {
          debugEmit(
            {
              type: 'render',
              store,
              component,
              componentId: componentId.current,
            },
            options,
          )
          rerender()
        },
        { ...options, component, componentId: componentId.current },
      )
    } else {
      store = useTrackableStore(store, rerender)
    }
  }

  useEffect(() => {
    store.didMount && store.didMount()
    return () => disposeStore(store)
  }, [])

  if (options && options.conditionalUse === false) {
    return null
  }

  return store
}

export const configureUseStore = (opts: UseGlobalStoreOptions) => {
  config = Object.freeze({
    ...config,
    ...opts,
  })
}

function isSourceEqual(oldStore: any, newStore: new () => any) {
  return oldStore.constructor.toString() === newStore.toString()
}

export function getCurrentComponent() {
  return ReactCurrentOwner && ReactCurrentOwner.current && ReactCurrentOwner.current.elementType
    ? ReactCurrentOwner.current.elementType
    : {}
}

export function useThrottledForceUpdate() {
  const [, setState] = useState(0)
  return useCallback(
    throttle(() => {
      setState(Math.random())
    }),
    [],
  )
}

let nextId = 0

// for use in children
// tracks every store used and updates if necessary

export function createUseStores<A extends Object>(StoreContext: React.Context<A>) {
  return function useStores(options?: { optional?: (keyof A)[]; debug?: boolean }): A {
    const stores = useContext(StoreContext)
    const stateRef = useRef(new Map<any, ReturnType<typeof setupTrackableStore>>())
    const rerender = useThrottledForceUpdate()
    const component = getCurrentComponent()
    const componentId = useRef(++nextId)

    const storesRef = useRef(null)

    useEffect(() => {
      return () => {
        for (const { dispose } of stateRef.current.values()) {
          dispose()
        }
        if (process.env.NODE_ENV === 'development') {
          debugEmit(
            {
              type: 'unmount',
              componentId: componentId.current,
            },
            options,
          )
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
                    componentId: componentId.current,
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
