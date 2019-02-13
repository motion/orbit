import { automagicClass } from '@mcro/automagical'
import { throttle } from 'lodash'
import { observable, observe, transaction } from 'mobx'
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

const { ReactCurrentOwner } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

type UseStoreDebugEvent =
  | {
      type: 'observe'
      key: string
      oldValue: any
      newValue: any
      store: any
      component: any
      componentId: number
    }
  | {
      type: 'render'
      store: any
      component: any
      componentId: number
    }
  | {
      type: 'prop'
      key: string
      oldValue: any
      newValue: any
      store: any
    }
  | {
      type: 'reactiveKeys'
      keys: Set<string>
      component: any
      componentId: number
      store: any
    }
  | {
      type: 'unmount'
      componentId: number
    }

let debugFns = new Set()
export function debugUseStore(cb: (event: UseStoreDebugEvent) => any) {
  debugFns.add(cb)
  return () => debugFns.delete(cb)
}

function debugEmit(event: UseStoreDebugEvent) {
  if (debugFns.size) {
    ;[...debugFns].map(fn => fn(event))
  }
}

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

function setupTrackableStore(store: any, rerender: Function, componentId?: number) {
  const component = getCurrentComponent()
  const reactiveKeys = new Set()
  let rendering = false
  let dispose = null

  return {
    store: new Proxy(store as any, {
      get(target, key) {
        if (rendering && typeof key === 'string') {
          reactiveKeys.add(key)
        }
        return Reflect.get(target, key)
      },
    }),
    track() {
      reactiveKeys.clear()
      rendering = true
      if (!dispose) {
        try {
          dispose = observe(store, change => {
            if (component.displayName === 'SubPane') {
              console.log('i see a change', change, rendering, reactiveKeys)
            }
            if (rendering) return
            if (change.type !== 'update') return
            if (!reactiveKeys.size) return
            if (!reactiveKeys.has(change['name'])) return
            if (process.env.NODE_ENV === 'development') {
              debugEmit({
                type: 'observe',
                key: change['name'],
                store,
                oldValue: change.oldValue,
                newValue: change.newValue,
                component,
                componentId,
              })
            }
            rerender()
          })
        } catch (err) {
          console.error(err)
        }
      }
    },
    untrack() {
      rendering = false
      if (process.env.NODE_ENV === 'development') {
        if (reactiveKeys.size) {
          debugEmit({
            type: 'reactiveKeys',
            keys: reactiveKeys,
            component,
            store,
            componentId,
          })
        }
      }
    },
    dispose: () => dispose && dispose(),
  }
}

export function useTrackableStore<A>(plainStore: A, rerenderCb: Function, componentId?: number): A {
  const trackableStore = useRef({
    store: null,
    track: null,
    untrack: null,
    dispose: null,
  })

  if (!trackableStore.current.store) {
    trackableStore.current = setupTrackableStore(plainStore, rerenderCb, componentId)
  }

  useEffect(() => {
    return () => {
      const bye = trackableStore.current.dispose
      if (bye) {
        bye()
      }
    }
  }, [])

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
  let store = useReactiveStore(Store, props)
  const rerender = useThrottledForceUpdate()
  const component = getCurrentComponent()
  const componentId = useRef(++nextId)

  if (process.env.NODE_ENV === 'development') {
    store = useTrackableStore(
      store,
      () => {
        debugEmit({
          type: 'render',
          store,
          component,
          componentId: componentId.current,
        })
        rerender()
      },
      componentId.current,
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
        debugEmit({
          type: 'unmount',
          componentId: componentId.current,
        })
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
  return useCallback(throttle(() => setState(Math.random())), [])
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
          debugEmit({
            type: 'unmount',
            componentId: componentId.current,
          })
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
            let next
            if (process.env.NODE_ENV === 'development') {
              next = setupTrackableStore(
                store,
                () => {
                  debugEmit({
                    type: 'render',
                    store,
                    component,
                    componentId: componentId.current,
                  })
                  rerender()
                },
                componentId.current,
              )
            } else {
              next = setupTrackableStore(store, rerender)
            }

            // track once immedaitely one because it will be missed by track block below
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
