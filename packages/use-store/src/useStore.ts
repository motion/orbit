import { AutomagicStore, configureAutomagical, CurrentComponent, decorate, updateProps, useCurrentComponent } from '@o/automagical'
import { isEqual } from '@o/fast-compare'
import { get, observable, set, transaction } from 'mobx'
import { useEffect, useRef } from 'react'

import { config } from './configure'
import { debugEmit } from './debugUseStore'
import { dehydrate, hydrate, HydrationState } from './hydration'
import { queueUpdate, removeUpdate } from './queueUpdate'
import { useTrackableStore } from './setupTrackableStore'
import { ReactiveStore } from './Store'
import { useForceUpdate } from './useForceUpdate'

export { unwrapProxy } from './unwrapProxy'
export { useForceUpdate } from './useForceUpdate'
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
  UpdatePriority,
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
  if (__DEV__ && component) {
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
  __hooksData: any
}

export function useHooks<A extends () => any>(hooks: A): ReturnType<A> & HooksObject {
  const object = observable.object(
    {
      __rerunHooks: () => {
        const res = hooks()
        transaction(() => {
          for (const key in res) {
            set(object, key, res[key])
          }
        })
      },
    },
    undefined,
    { deep: false },
  ) as any
  return new Proxy(object, {
    get(_, key) {
      return get(object, key)
    },
  })
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

  if (__DEV__) {
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

const requestIdleCallback =
  typeof window !== 'undefined' ? window['requestIdleCallback'] : x => setTimeout(x, 100)

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
    if (__DEV__) {
      // set initial state for hmr purposes
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
    // run hooks after construct so props are there
    let allHooks: HooksObject[] = []
    for (const key in store) {
      const hook = store[key]
      if (hook && hook.__rerunHooks) {
        hook.__rerunHooks()
        // hook.__stopCheckingPropRead()
        allHooks.push(hook)
      }
    }
    // set final state
    state.current.hooks = allHooks
    state.current.pendingHooks = false
  }

  // update props after first run, before hooks re-run
  if (props && !shouldSetupStore) {
    updateProps(store, props)
  }

  if (!state.current.pendingHooks) {
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
  const stateRef = useRef<{
    lastStore: false | A | (new () => A)
    shouldReact: boolean
    isInstantiated: boolean
    dispose: any
    id: string | number | undefined
  }>()
  let store: any = null

  if (!stateRef.current) {
    stateRef.current = {
      lastStore: Store,
      shouldReact,
      isInstantiated,
      dispose: null as any,
      id: options ? options.id : '',
    }
  }

  let state = stateRef.current!

  // reset when id changes
  if (options && state.id !== options.id) {
    state.isInstantiated = false
  }

  if (__DEV__) {
    if (state.shouldReact !== shouldReact) {
      console.warn(`You're changing { react: true }, this is not allowed.`)
    }
    if (state.isInstantiated !== isInstantiated) {
      console.warn(
        `You're changing the instantiation of a store passed to useStore, this is not allowed.`,
      )
    }
  }

  if (state.isInstantiated) {
    // [HMR] shouldUpdate handles if a new store comes down for the same hook, update it
    const shouldUpdate = state.lastStore !== Store
    if (shouldUpdate && state.lastStore) {
      disposeStore(state.lastStore)
    }
    state.lastStore = Store
    store = Store
    if (shouldReact) {
      store = useTrackableStore(component, store, rerender, { ...options, component, shouldUpdate })
        .store
    }
    if (!!store && props) {
      updateProps(store, props as any)
    }
  } else {
    const res = useReactiveStore(Store as any, props)
    if (res) {
      state.dispose = res.dispose
      store = res.store
    }
    if (shouldReact) {
      store = useTrackableStore(component, store, rerender, {
        ...options,
        component,
        shouldUpdate: res ? res.hasChangedSource : undefined,
      }).store
    }
  }

  // dispose on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current!.dispose) {
        stateRef.current!.dispose()
      }
      if (!stateRef.current!.isInstantiated) {
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
