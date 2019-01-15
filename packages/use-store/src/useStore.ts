import { automagicClass } from '@mcro/automagical'
import { isValidElement, useRef, createContext, useEffect } from 'react'
import { observable, transaction } from 'mobx'
import isEqual from 'react-fast-compare'

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
      if (a !== b) {
        // this is a bit risky and weird but i cant think of a case it would ever have broken
        // if you use functions as render callbacks and then *change* them during renders this would break
        if (typeof a === 'function' && typeof b === 'function') {
          if (a.toString() === b.toString()) {
            continue
          }
        }
        if (!isEqual(a, b)) {
          if (process.env.NODE_ENV === 'development' && options && options.debug) {
            console.log('has changed prop', prop, nextProps[prop])
          }
          props[prop] = nextProps[prop]
        }
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

const setupStoreReactiveProps = <A>(Store: new () => A, props?: Object) => {
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

const useReactiveStore = <A extends any>(
  Store: new () => A,
  props: any,
  options?: UseStoreOptions,
): A => {
  const storeHooks = useRef<Function[] | null>(null)
  const storeRef = useRef<A>(null)
  const hasChangedSource = storeRef.current && !isSourceEqual(storeRef.current, Store)

  if (!storeRef.current || hasChangedSource) {
    const { store, hooks } = setupStoreReactiveProps(Store, props)
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

export function useStore<P, A extends { props?: P } | any>(
  Store: new () => A,
  props?: P,
  options?: UseStoreOptions,
): A {
  const store = useReactiveStore(Store, props, options)

  // stores can use didMount and willUnmount
  useEffect(() => {
    store.didMount && store.didMount()
    return () => {
      store.willUnmount && store.willUnmount()
      // TODO need to hook into reactions better/clearly with this...
      if (store.subscriptions) {
        store.subscriptions.dispose()
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
