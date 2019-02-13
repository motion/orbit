import { decorate, dispose } from '@mcro/automagical'
import { throttle } from 'lodash'
import { observable, transaction } from 'mobx'
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
import isEqualReact from 'react-fast-compare'
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
}

let globalOptions = {
  onMount: null,
  onUnmount: null,
  context: createContext(null),
}

export function disposeStore(store: any) {
  store.unmounted = true
  store.willUnmount && store.willUnmount()
  if (globalOptions.onUnmount) {
    globalOptions.onUnmount(store)
  }
  dispose(store)
}

// updateProps
// granular set so reactions can be efficient
const updateProps = (store: any, nextProps: Object) => {
  const nextPropsKeys = Object.keys(nextProps)
  const curPropKeys = Object.keys(store.props)

  // changes
  transaction(() => {
    for (const prop of nextPropsKeys) {
      const a = store.props[prop]
      const b = nextProps[prop]
      if (!isEqualReact(a, b)) {
        if (process.env.NODE_ENV === 'development') {
          debugEmit({
            type: 'prop',
            key: prop,
            oldValue: a,
            newValue: b,
            store,
          })
        }
        store.props[prop] = b
      }
    }

    // removes
    for (const key of curPropKeys) {
      if (typeof nextProps[key] === 'undefined') {
        delete store.props[key]
      }
    }
  })
}

let currentHooks = null

export function useHook<A extends ((...args: any[]) => any)>(cb: A): ReturnType<A> {
  currentHooks = currentHooks || []
  currentHooks.push(cb)
  return cb()
}

function setupReactiveStore<A>(Store: new () => A, props?: Object) {
  // automagic store
  const AutomagicStore = decorate(Store)

  let storeInstance: A

  // capture hooks for this store
  currentHooks = null

  if (!props) {
    storeInstance = new AutomagicStore()
  } else {
    // add props to the store and manage them
    const storeProps = observable({ props }, { props: observable.shallow })
    const getProps = {
      configurable: true,
      get: () => storeProps.props,
      set() {},
    }
    Object.defineProperty(AutomagicStore.prototype, 'props', getProps)
    storeInstance = new AutomagicStore()
    Object.defineProperty(storeInstance, 'props', getProps)
    storeInstance['__updateProps'] = updateProps
  }

  // call this before automagic runs...
  if (globalOptions.onMount) {
    globalOptions.onMount(storeInstance)
  }

  return {
    store: storeInstance,
    hooks: currentHooks,
  }
}

function useReactiveStore<A extends any>(Store: new () => A, props?: any): A {
  const storeHooks = useRef<Function[] | null>(null)
  const storeRef = useRef<A>(null)
  const hasChangedSource = storeRef.current && !isSourceEqual(storeRef.current, Store)

  if (!storeRef.current || hasChangedSource) {
    const { hooks, store } = setupReactiveStore(Store, props)
    storeRef.current = store
    storeHooks.current = hooks
  } else {
    // ensure we dont have different number of hooks by re-running them
    if (storeHooks.current) {
      // TODO this wont actually update them :/
      for (const hook of storeHooks.current) {
        hook()
      }
    }
  }

  // update props after first run
  if (props && !!storeRef.current) {
    storeRef.current.__updateProps(storeRef.current, props)
  }

  return storeRef.current
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

  // TODO this can be refactored so it just does the global options probably
  // stores can use didMount and willUnmount
  useEffect(() => {
    store.didMount && store.didMount()
    return () => {
      disposeStore(store)
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

  if (options && options.conditionalUse === false) {
    return null
  }

  return store
}

export const configureUseStore = (opts: UseGlobalStoreOptions) => {
  globalOptions = Object.freeze({
    ...globalOptions,
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
export function createUseStores<A extends Object>(StoreContext: React.Context<A>) {
  return function useStores(options?: { optional?: (keyof A)[]; debug?: boolean }): A {
    const stores = useContext(StoreContext)
    const stateRef = useRef(new Map<any, ReturnType<typeof setupTrackableStore>>())
    const state = stateRef.current
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
