import { automagicClass } from '@mcro/automagical'
import { isEqual, throttle } from 'lodash'
import { observable, reaction, transaction } from 'mobx'
import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  // @ts-ignore
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from 'react'
import isEqualReact from 'react-fast-compare'

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
  if (store.subscriptions) {
    store.subscriptions.dispose()
  }
}

const isReactElement = (x: any) => {
  if (!x) {
    return false
  }
  if (isValidElement(x)) {
    return true
  }
  if (Array.isArray(x)) {
    return x.some(isValidElement)
  }
  return false
}

const propKeysWithoutElements = (props: Object) =>
  Object.keys(props).filter(x => !isReactElement(props[x]))

// updateProps
// granular set so reactions can be efficient
const updateProps = (props: Object, nextProps: Object, options?: UseStoreOptions) => {
  const nextPropsKeys = propKeysWithoutElements(nextProps)
  const curPropKeys = propKeysWithoutElements(props)

  // changes
  transaction(() => {
    for (const prop of nextPropsKeys) {
      const a = props[prop]
      const b = nextProps[prop]
      if (!isEqualReact(a, b)) {
        if (process.env.NODE_ENV === 'development' && options && options.debug) {
          console.log('has changed prop', prop, nextProps[prop])
        }
        props[prop] = nextProps[prop]
      }
    }

    // removes
    for (const key of curPropKeys) {
      if (typeof nextProps[key] === 'undefined') {
        delete props[key]
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
  Store.prototype.automagic = automagicClass
  let storeInstance: A

  // capture hooks for this store
  currentHooks = null

  if (!props) {
    storeInstance = new Store()
  } else {
    // add props to the store and manage them
    const storeProps = observable({ props }, { props: observable.shallow })
    const getProps = {
      configurable: true,
      get: () => storeProps.props,
      set() {},
    }
    Object.defineProperty(Store.prototype, 'props', getProps)
    storeInstance = new Store()
    Object.defineProperty(storeInstance, 'props', getProps)
    storeInstance['__updateProps'] = updateProps
  }

  // call this before automagic runs...
  if (globalOptions.onMount) {
    globalOptions.onMount(storeInstance)
  }

  // @ts-ignore
  storeInstance.automagic({
    isSubscribable: x => x && typeof x.subscribe === 'function',
  })

  return {
    store: storeInstance,
    hooks: currentHooks,
  }
}

function useReactiveStore<A extends any>(
  Store: new () => A,
  props?: any,
  options?: UseStoreOptions,
): A {
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
    storeRef.current.__updateProps(storeRef.current.props, props, options)
  }

  return storeRef.current
}

function setupTrackableStore(store: any, rerender: Function) {
  let tracking = false
  let lastReactiveKeys = new Set()
  let reactiveKeys = new Set()
  let unwatch = null

  const watchForUpdates = () => {
    if (isEqual(lastReactiveKeys, reactiveKeys)) {
      return
    }
    const reactiveKeyArr = [...reactiveKeys]
    lastReactiveKeys = new Set(reactiveKeyArr)
    if (unwatch) {
      unwatch()
    }
    if (reactiveKeyArr.length) {
      unwatch = reaction(
        () => {
          for (const key of reactiveKeyArr) {
            store[key]
          }
          return Math.random()
        },
        () => {
          rerender()
        },
      )
    }
  }

  return {
    store: new Proxy(store as any, {
      get(target, key) {
        if (tracking && typeof key === 'string' && key !== '$$typeof') {
          reactiveKeys.add(key)
        }
        return Reflect.get(target, key)
      },
    }),
    track() {
      reactiveKeys.clear()
      tracking = true
    },
    untrack() {
      tracking = false
      watchForUpdates()
    },
  }
}

export function useTrackableStore<A>(plainStore: A): A {
  const trackableStore = useRef({
    store: null,
    track: null,
    untrack: null,
  })
  const rerenderComponent = useForceRerender()

  if (!trackableStore.current.store) {
    const throttledRerender = throttle(rerenderComponent)
    trackableStore.current = setupTrackableStore(plainStore, throttledRerender)
  }

  const { store, track, untrack } = trackableStore.current

  track()
  useLayoutEffect(untrack)

  return store
}

export function useStore<P, A extends { props?: P } | any>(
  Store: new () => A,
  props?: P,
  options?: UseStoreOptions,
): A {
  let store = useReactiveStore(Store, props, options)
  store = useTrackableStore(store)

  // TODO this can be refactored so it just does the global options probably
  // stores can use didMount and willUnmount
  useEffect(() => {
    store.didMount && store.didMount()
    return () => {
      disposeStore(store)
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

export function useCurrentComponent() {
  return ReactCurrentOwner && ReactCurrentOwner.current && ReactCurrentOwner.current.elementType
    ? ReactCurrentOwner.current.elementType
    : {}
}

export function useForceRerender() {
  const [, setState] = useState(0)
  return useCallback(() => setState(Math.random()), [])
}

// for use in children
export function createUseStores<A extends Object>(StoreContext: React.Context<A>) {
  return function useStores(options?: { optional?: (keyof A)[] }): A {
    const stores = useContext(StoreContext)
    const stateRef = useRef(new Map<any, ReturnType<typeof setupTrackableStore>>())
    const state = stateRef.current
    const rerender = useForceRerender()
    const rerenderThrottled = useMemo(() => throttle(rerender), [])
    const storesRef = useRef(null)

    if (!storesRef.current) {
      // this will throw if they try and access a store thats not provided
      // should give us runtime safety without as much type overhead everywhere
      storesRef.current = new Proxy(stores, {
        get(target, key) {
          const val = Reflect.get(target, key)

          // found a store, wrap it for tracking
          if (typeof val !== 'undefined') {
            // wrap each store with trackable
            if (state.has(val)) {
              return state.get(val).store
            }
            const next = setupTrackableStore(val, rerenderThrottled)
            // track once immedaitely one because it will be missed by track block below
            next.track()
            state.set(val, next)
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
