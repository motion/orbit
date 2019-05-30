import { AutomagicStore, CurrentComponent, decorate, updateProps, useCurrentComponent } from '@o/automagical'
import { isEqual } from '@o/fast-compare'
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
export { syncFromProp, syncToProp } from './syncProps'

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

  const Store = decorate(OGStore, initialProps as Object)
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
  if (!store.dispose) {
    debugger
  }
  store.dispose()
}

let captureHooks: any = null

type Fn = (...args: any[]) => any
type ObjectFns = { [key: string]: Fn }

type ObjectReturnTypes<T extends ObjectFns> = { [P in keyof T]: ReturnType<T[P]> }

export function useHooks<A extends ObjectFns>(hooks: A): ObjectReturnTypes<A> {
  const getValues = () => {
    let res: any = {}
    for (const key in hooks) {
      res[key] = hooks[key]()
    }
    return res
  }
  captureHooks = shallow({
    ...getValues(),
    __getHooksValues: getValues,
  })
  return captureHooks
}

function setupReactiveStore<A>(Store: new () => A, props?: any) {
  const component = useCurrentComponent()
  const AutomagicStore = decorate(Store, props)

  // capture hooks for this store, must be before new AutomagicStore()
  captureHooks = null
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
    hooks: captureHooks,
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
  Store: new () => A | false,
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
    // re-run hooks
    const hooks = state.current.hooks
    if (hooks) {
      let next = hooks['__getHooksValues']()
      for (const key in hooks) {
        if (key === '__getHooksValues') continue
        if (next[key] !== hooks[key]) {
          hooks[key] = next[key]
        }
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
  Store: { new (): A } | A | false,
  props?: InferProps<A>,
  options?: UseStoreOptions,
): A {
  const component = useCurrentComponent()
  const rerender = useForceUpdate()
  const lastStore = useRef(Store)
  const isInstantiated = Store && Store['constructor'].name !== 'Function'
  let store: any = null

  if (isInstantiated) {
    // [HMR] shouldUpdate handles if a new store comes down for the same hook, update it
    const shouldUpdate = lastStore.current !== Store
    if (shouldUpdate && lastStore.current) {
      disposeStore(lastStore.current)
    }
    lastStore.current = Store
    store = Store
    store = useTrackableStore(store, rerender, { ...options, component, shouldUpdate })
    if (!!store && props) {
      console.log('stores', store, props)
      updateProps(store, props as any)
    }
  } else {
    const res = useReactiveStore(Store as any, props)
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
    if (!isInstantiated) {
      return () => {
        store && disposeStore(store, component)
      }
    }
  }, [store, isInstantiated])

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
