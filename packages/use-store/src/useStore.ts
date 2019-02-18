import { CurrentComponent, decorate, updateProps, useCurrentComponent } from '@mcro/automagical'
import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from './configure'
import { debugEmit } from './debugUseStore'
import { useTrackableStore } from './setupTrackableStore'

export { IS_STORE } from '@mcro/automagical'
export { configureUseStore } from './configure'
export { createUseStores } from './createUseStores'
export { debugUseStore } from './debugUseStore'

type UseStoreOptions = {
  debug?: boolean
  conditionalUse?: boolean
  react?: boolean
}

export function disposeStore(store: any, component: CurrentComponent) {
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
  const component = useCurrentComponent()
  const rerender = useForceUpdate()
  const isInstantiated = Store['constructor'].name !== 'Function'
  let store = null

  if (isInstantiated) {
    store = (Store as unknown) as A
    store = useTrackableStore(store, rerender, { ...options, component })
  } else {
    store = Store as new () => A
    store = useReactiveStore(store, props)
    if (!options || options.react !== false) {
      store = useTrackableStore(store, rerender, { ...options, component })
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
