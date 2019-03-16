import { CurrentComponent, decorate, updateProps, useCurrentComponent } from '@o/automagical'
import { observable } from 'mobx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from './configure'
import { debugEmit } from './debugUseStore'
import { useTrackableStore } from './setupTrackableStore'

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
export { createUseStores, UseStoresOptions } from './createUseStores'
export { debugUseStore } from './debugUseStore'
export { GET_STORE, resetTracking } from './mobxProxyWorm'

// helpers for deep/shallow objects, which dont mess up types

export const deep = <X>(x: X) => {
  return (observable(x) as unknown) as X
}

export const shallow = <X>(x: X) => {
  return (observable.object(x, null, { deep: false }) as unknown) as X
}

type UseStoreOptions = {
  debug?: boolean
  conditionalUse?: boolean
  react?: boolean
}

export function disposeStore(store: any, component?: CurrentComponent) {
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

function useReactiveStore<A extends any>(
  Store: new () => A,
  props?: any,
): { store: A; hasChangedSource: boolean } {
  const forceUpdate = useForceUpdate()
  const state = useRef({
    store: null,
    hooks: null,
    hasProps: null,
  })
  let store = state.current.store
  const hasChangedSource = store && !isSourceEqual(store, Store)

  if (!store || hasChangedSource) {
    if (hasChangedSource) {
      disposeStore(state.current.store)
    }
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

  return { store: state.current.store, hasChangedSource }
}

// allows us to use instantiated or non-instantiated stores
// sets up tracking so the component auto re-renders
export function useStore<A>(
  Store: { new (): A } | A,
  props?: A extends { props: infer R } ? R : undefined,
  options?: UseStoreOptions,
): A {
  const component = useCurrentComponent()
  const rerender = useForceUpdate()
  const lastStore = useRef(Store)
  const instantiated = useRef(Store && Store['constructor'].name !== 'Function').current
  let store = null

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
    store = Store as new () => A
    const res = useReactiveStore(store, props)
    store = res.store
    if (!options || options.react !== false) {
      store = useTrackableStore(store, rerender, {
        ...options,
        component,
        shouldUpdate: res.hasChangedSource,
      })
    }
  }

  // dispose on unmount
  useEffect(() => {
    if (instantiated) {
      return () => disposeStore(store, component)
    }
  }, [])

  if (!Store) {
    // this bug was caused by having the app view not wrapped by HMR
    // like `export default createApp({ app: (props) => <div /> })`
    console.warn('no store given...', Store, store)
  }

  if (options && options.conditionalUse === false) {
    return null
  }

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
