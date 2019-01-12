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

const setupStoreWithReactiveProps = <A>(Store: new () => A, props?: Object) => {
  Store.prototype.automagic = automagicClass

  let storeInstance: A

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

  return storeInstance
}

const useStoreWithReactiveProps = (
  Store: any,
  props: any,
  hasChangedSource = false,
  options?: UseStoreOptions,
) => {
  let store = useRef(null)
  if (!store.current || hasChangedSource) {
    store.current = setupStoreWithReactiveProps(Store, props)
  }
  // update props after first run
  if (props && !!store.current) {
    store.current.__updateProps(store.current.props, props, options)
  }
  return store.current
}

export function useStore<P, A extends { props?: P } | any>(
  Store: new () => A,
  props?: P,
  options?: UseStoreOptions,
): A {
  if (options && options.conditionalUse === false) {
    return null as any
  }

  const proxyStore = useRef(null)
  const hasChangedSource = !proxyStore.current ? false : !isSourceEqual(proxyStore.current, Store)
  const store = useStoreWithReactiveProps(Store, props, hasChangedSource, options)

  // stores can use didMount and willUnmount
  useEffect(() => {
    if (store.didMount) {
      store.didMount()
    }
    return () => {
      if (store.willUnmount) {
        store.willUnmount()
      }
    }
  }, [])

  // setup store once or if changed
  if (!proxyStore.current || hasChangedSource) {
    proxyStore.current = store
  }

  return (proxyStore.current as unknown) as A
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
