import { AutomagicStore, configureAutomagical, CurrentComponent, decorate, updateProps, useCurrentComponent } from '@o/automagical'
import { isEqual } from '@o/fast-compare'
import { debounce } from 'lodash'
import { _interceptReads, observable, observe, transaction } from 'mobx'
import { useCallback, useEffect, useRef, useState } from 'react'

import { config } from './configure'
import { debugEmit } from './debugUseStore'
import { dehydrate, hydrate, HydrationState } from './hydration'
import { GET_STORE } from './mobxProxyWorm'
import { queueUpdate, removeUpdate } from './queueUpdate'
import { useTrackableStore } from './setupTrackableStore'
import { ReactiveStore } from './Store'

export {
  always,
  cancel,
  decorate,
  ensure,
  IS_STORE,
  react,
  ReactionRejectionError,
  useCurrentComponent,
  useReaction,
} from '@o/automagical'
export { configureUseStore } from './configure'
export { createStoreContext } from './createStoreContext'
export { createUseStores, UseStoresOptions, UseStores } from './createUseStores'
export { debugUseStore } from './debugUseStore'
export { resetTracking } from './mobxProxyWorm'
export { Store } from './Store'
export { syncFromProp, syncToProp } from './syncProps'

// make automagical (useReaction, et all) use our queuedUpdate
// TODO could possible move queueUpdate into automagical? it's lower level so makes sense
configureAutomagical({
  queueUpdate,
  clearQueuedUpdate: removeUpdate,
})

export interface UseStore<A extends ReactiveStore<any> | any> {
  (Store: { new (): A } | A | false, props?: InferProps<A>, options?: UseStoreOptions): A
}

export interface UseStoreCurried<A extends ReactiveStore<any> | any> {
  (options?: UseStoreOptions): A
}

export type UsableStore<T, Props> = T & AutomagicStore<Props> & { useStore: UseStoreCurried<T> }

type InferProps<T> = T extends { props: infer R } ? R : undefined

const StoreCache = {}
const StoreCacheInitialProps = {}

export function createUsableStore<T, Props extends InferProps<T>>(
  OGStore: { new (...args: any[]): T },
  initialProps?: Props,
): UsableStore<T, Props> {
  if (!OGStore) {
    throw new Error(`Must pass store`)
  }
  // HMR, dont reset store
  // assumes you only use one name per store, for now, we could make it fancy
  const hmrKey = OGStore.toString()
  const existing = StoreCache[hmrKey]
  if (existing) {
    const oldInitialProps = StoreCacheInitialProps[hmrKey]
    if (isEqual(existing.props, oldInitialProps) && !isEqual(oldInitialProps, initialProps)) {
      console.log('HMR store props', OGStore.name)
      // havent changed props, hot update them to new ones
      existing.props = initialProps
    }
    return existing
  }

  const Store = decorate(OGStore, (initialProps as any) || {})
  const store = (new Store() as any) as UsableStore<T, Props>
  store.useStore = options => useStore(store, undefined, options)
  StoreCache[hmrKey] = store
  StoreCacheInitialProps[hmrKey] = initialProps
  return store
}

export const unwrapProxy = (store: any) => {
  return store ? store[GET_STORE] || store : store
}

// helpers for deep/shallow objects, which dont mess up types

export const deep = <X>(x: X) => {
  return (observable(x) as unknown) as X
}

export const shallow = <X>(x: X) => {
  return (observable.object(x, undefined, { deep: false }) as unknown) as X
}

export type UseStoreOptions = {
  // logs information
  debug?: boolean
  // if false, view wont update on store changes
  react?: boolean
  // if changed will recreate the store
  id?: string | number
}

export function disposeStore(store: any, component?: CurrentComponent) {
  store.unmounted = true
  store.willUnmount && store.willUnmount()
  if (process.env.NODE_ENV === 'development' && component) {
    debugEmit({
      type: 'unmount',
      store,
      component,
    })
  }
  store.dispose()
}

/**
 * Simple way to add hooks into a store
 * Keeps types a lot simpler than using props
 */

type HooksObject = {
  __rerunHooks: () => any
  __setUpdater: Function
  __dispose?: Function
}

export function useHooks<A extends () => any>(hooks: A, store?: any): ReturnType<A> & HooksObject {
  let updater: Function | null = null
  const __setUpdater = cb => {
    updater = debounce(cb)
  }
  let trackProps = new Set<string>()
  let disposeReads: any[] = []
  if (store) {
    for (const prop in store.props) {
      disposeReads.push(
        _interceptReads(store.props, prop, () => {
          trackProps.add(prop)
        }),
      )
    }
  }
  let __dispose
  if (trackProps.size) {
    __dispose = observe(store.props, change => {
      if (updater && trackProps.has(change['name'])) {
        updater()
      }
    })
  }
  for (const dispose of disposeReads) {
    dispose()
  }

  // why observable map? it triggers on key changes
  // and we will add new keys as promises throw/update
  const hooksData = observable.map({}, { deep: false })

  // then use a proxy just so we can convert map back into object api
  return new Proxy(
    {
      __hooksData: hooksData,
      __rerunHooks: () => {
        const res = hooks()
        for (const key in res) {
          hooksData.set(key, res[key])
        }
      },
      __setUpdater,
      __dispose,
    },
    {
      get(target, key) {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key)
        }
        return hooksData.get(key)
      },
      set(_, key, value) {
        hooksData.set(key, value)
        return true
      },
    },
  ) as any
}

// // this is reactive so we can capture this.props and other reactive state inside hooks call

function setupReactiveStore<A>(Store: new () => A, props?: any): ReactiveStoreDesc {
  const component = useCurrentComponent()
  const AutomagicStore = decorate(Store, props)

  // capture hooks for this store, must be before new AutomagicStore()
  const store = new AutomagicStore()
  const hasHooks = Object.keys(store).some(x => store[x] && !!store[x].__rerunHooks)

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
    hasHooks,
    hasProps: !!props,
  }
}

type ReactiveStoreDesc = {
  store: any
  hasHooks: boolean
  hasProps: boolean | null
}

type ReactiveStoreState = ReactiveStoreDesc & {
  hooks: HooksObject[] | null
  pendingHooks?: boolean
  initialState?: HydrationState | null
  id: any
}

const initialStoreState: ReactiveStoreState = {
  id: '',
  pendingHooks: false,
  hasHooks: false,
  store: null,
  initialState: null,
  hooks: null,
  hasProps: null,
} as const

function useReactiveStore<A extends any>(
  Store: new () => A | false,
  props?: any,
  options?: UseStoreOptions,
): { store: A; hasChangedSource: boolean; dispose: Function | null } | null {
  const forceUpdate = useForceUpdate()
  const state = useRef<ReactiveStoreState>(initialStoreState)

  // clear state on id change
  if (options && options.id !== state.current.id) {
    state.current = initialStoreState
  }

  let store = state.current.store
  let dispose: Function | null = null
  const hasChangedSource = store && !isSourceEqual(store, Store)

  if (!Store) {
    return null
  }

  const shouldSetupStore = (!store && !state.current.pendingHooks) || hasChangedSource

  if (shouldSetupStore) {
    // sets up store and does some hmr state preservation logic
    let previousState: HydrationState | null = null
    let previousInitialState: HydrationState | null = null
    if (hasChangedSource) {
      if (state.current.initialState) {
        previousInitialState = state.current.initialState
      }
      previousState = dehydrate(state.current.store)
      disposeStore(state.current.store)
    }
    const next = setupReactiveStore(Store, props)
    state.current = { ...state.current, ...next, id: options ? options.id : '' }
    if (next.hasHooks) {
      state.current.pendingHooks = true
    }
    if (process.env.NODE_ENV === 'development') {
      // set initial state for hmr purposes
      const requestIdleCallback =
        typeof window !== 'undefined' ? window['requestIdleCallback'] : setTimeout
      requestIdleCallback(() => {
        state.current = {
          ...state.current,
          initialState: dehydrate(next.store),
        }
      })
    }
    if (hasChangedSource && previousInitialState) {
      hydrate(state.current.store, previousInitialState, previousState)
    }
  }

  // update after creation
  store = state.current.store

  // handle hooks after construct to avoid re-constructing store as hooks resolve
  // we need this special case so we can properly set them up the first time
  // so that the props on store are updated and then passed to hooks
  if (state.current.pendingHooks) {
    let didThrowPromise = false
    // run hooks after construct so props are there
    let allHooks: HooksObject[] = []
    try {
      for (const key in store) {
        const hook = store[key]
        if (hook && hook.__rerunHooks) {
          hook.__rerunHooks()
          allHooks.push(hook)
        }
      }
    } catch (err) {
      if (err instanceof Promise) {
        didThrowPromise = true
      }
      throw err
    }
    if (!didThrowPromise) {
      // set final state
      state.current.hooks = allHooks
      state.current.pendingHooks = false
      // add dispose
      dispose = () => {
        allHooks.forEach(hook => hook.__dispose && hook.__dispose())
      }
      // set the updater
      allHooks.forEach(hook => {
        hook.__setUpdater(forceUpdate)
      })
    }
  } else {
    if (!shouldSetupStore) {
      // re-run hooks
      const hooks = state.current.hooks
      if (hooks && hooks.length) {
        transaction(function updateHooks() {
          for (const hook of hooks) {
            let next = hook.__rerunHooks()
            if (next) {
              for (const key in next) {
                if (key[0] === '_' && key[1] === '_') continue
                if (next[key] !== hooks[key]) {
                  console.log('updating hooks', hook[key], next[key])
                  hook[key] = next[key]
                }
              }
            }
          }
        })
      }
    }
  }

  // update props after first run, before hooks re-run
  if (props && !shouldSetupStore) {
    updateProps(store, props)
  }

  if (hasChangedSource) {
    console.log('HMR store', Store.name)
    forceUpdate()
  }

  return { store, hasChangedSource, dispose }
}

// allows us to use instantiated or non-instantiated stores
// sets up tracking so the component auto re-renders

export function useStore<A extends ReactiveStore<any> | any>(
  Store: { new (): A } | A | false,
  props?: InferProps<A>,
  options?: UseStoreOptions,
): A {
  const component = useCurrentComponent()
  const rerender = useForceUpdate()
  rerender['component'] = component
  const shouldReact = !options || options.react !== false
  const isInstantiated = Store && Store['constructor'].name !== 'Function'
  const state = useRef({
    lastStore: Store,
    shouldReact,
    isInstantiated,
    dispose: null as any,
    id: options ? options.id : '',
  })
  let store: any = null

  // reset when id changes
  if (options && state.current.id !== options.id) {
    state.current.isInstantiated = false
  }

  if (process.env.NODE_ENV === 'development') {
    if (state.current.shouldReact !== shouldReact) {
      console.warn(`You're changing { react: true }, this is not allowed.`)
    }
    if (state.current.isInstantiated !== isInstantiated) {
      console.warn(
        `You're changing the instantiation of a store passed to useStore, this is not allowed.`,
      )
    }
  }

  if (state.current.isInstantiated) {
    // [HMR] shouldUpdate handles if a new store comes down for the same hook, update it
    const shouldUpdate = state.current.lastStore !== Store
    if (shouldUpdate && state.current.lastStore) {
      disposeStore(state.current.lastStore)
    }
    state.current.lastStore = Store
    store = Store
    if (shouldReact) {
      store = useTrackableStore(store, rerender, { ...options, component, shouldUpdate }).store
    }
    if (!!store && props) {
      updateProps(store, props as any)
    }
  } else {
    const res = useReactiveStore(Store as any, props)
    if (res) {
      state.current.dispose = res.dispose
      store = res.store
    }
    if (shouldReact) {
      store = useTrackableStore(store, rerender, {
        ...options,
        component,
        shouldUpdate: res ? res.hasChangedSource : undefined,
      }).store
    }
  }

  // dispose on unmount
  useEffect(() => {
    return () => {
      if (state.current.dispose) {
        state.current.dispose()
      }
      if (!state.current.isInstantiated) {
        store && disposeStore(store, component)
      }
    }
  }, [])

  return store
}

// no tracking
export function useStoreSimple<A>(
  Store: { new (): A } | A,
  props?: A extends { props: infer R } ? R : undefined,
  options?: UseStoreOptions,
): A {
  return useStore(Store, props as any, { ...options, react: false })
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
