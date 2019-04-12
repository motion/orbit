import { CurrentComponent, decorate, updateProps, useCurrentComponent } from '@o/automagical'
import { observable } from 'mobx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from './configure'
import { debugEmit } from './debugUseStore'
import { dehydrate, hydrate, HydrationState } from './hydration'
import { GET_STORE } from './mobxProxyWorm'
import { useTrackableStore } from './setupTrackableStore'
import { ReactiveStore } from './Store'

export {
  always,
  cancel,
  configureAutomagical,
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
export { createUseStores, UseStoresOptions } from './createUseStores'
export { debugUseStore } from './debugUseStore'
export { resetTracking } from './mobxProxyWorm'
export { Store } from './Store'

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
  debug?: boolean
  react?: boolean
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

let currentHooks: any[] = []

export function useHook<A extends (...args: any[]) => any>(cb: A): ReturnType<A> {
  currentHooks.push(cb)
  return cb()
}

function setupReactiveStore<A>(Store: new () => A, props?: Object) {
  const component = useCurrentComponent()
  const AutomagicStore = decorate(Store, props)

  // capture hooks for this store, must be before new AutomagicStore()
  currentHooks = []
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

type ReactiveStoreState = {
  store: any
  initialState: HydrationState | null
  hooks: any[] | null
  hasProps: boolean | null
}

function useReactiveStore<A extends any>(
  Store: new () => A,
  props?: any,
): { store: A; hasChangedSource: boolean } | null {
  const forceUpdate = useForceUpdate()
  const state = useRef<ReactiveStoreState>({
    store: null,
    initialState: null,
    hooks: null,
    hasProps: null,
  })
  let store = state.current.store
  const hasChangedSource = store && !isSourceEqual(store, Store)

  if (!Store) {
    return null
  }

  if (!store || hasChangedSource) {
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
    state.current = {
      ...next,
      initialState: dehydrate(next.store),
    }
    if (hasChangedSource && previousInitialState) {
      hydrate(state.current.store, previousInitialState, previousState)
    }
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

  return { store: state.current.store, hasChangedSource }
}

// allows us to use instantiated or non-instantiated stores
// sets up tracking so the component auto re-renders
export function useStore<A extends ReactiveStore<any> | any>(
  Store: { new (): A } | A,
  props?: A extends { props: infer R } ? R : undefined,
  options?: UseStoreOptions,
): A {
  const component = useCurrentComponent()
  const rerender = useForceUpdate()
  const lastStore = useRef(Store)
  const instantiated = useRef(Store && Store['constructor'].name !== 'Function').current
  let store: A | null = null

  if (instantiated) {
    if (options && options.react === false) {
      throw new Error(`Doesn't make sense to not react to an instatiated store.`)
    }
    // shouldUpdate handles if a new store comes down for the same hook, update it
    const shouldUpdate = lastStore.current !== Store
    lastStore.current = Store
    store = (Store as unknown) as A
    store = useTrackableStore(store, rerender, { ...options, component, shouldUpdate })
  } else {
    const res = useReactiveStore(Store as new () => A, props)
    store = res && res.store
    if (!options || options.react !== false) {
      store = useTrackableStore(store, rerender, {
        ...options,
        component,
        shouldUpdate: res ? res.hasChangedSource : undefined,
      })
    }
  }

  // dispose on unmount
  useEffect(() => {
    if (instantiated) {
      return () => {
        store && disposeStore(store, component)
      }
    }
  }, [])

  return store as A
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
