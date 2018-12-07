import { automagicClass } from '@mcro/automagical'
import { isValidElement, useRef, createContext } from 'react'
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
  props: Object,
  shouldHMR = false,
  options?: UseStoreOptions,
) => {
  // only setup props if we need to
  let store = useRef(Store.constructor ? null : Store)
  const shouldSetup = !store.current || shouldHMR
  if (shouldSetup) {
    store.current = setupStoreWithReactiveProps(Store, props)
  }
  // only update props after first run
  if (props && !shouldSetup) {
    store.current.__updateProps(store.current.props, props, options)
  }
  return store.current
}

export function useStore<A>(Store: new () => A, props?: Object, options?: UseStoreOptions): A {
  if (options && options.conditionalUse === false) {
    return null
  }
  const proxyStore = useRef(null)
  const hasSetupStore = !proxyStore.current
  const isHMRCompat = process.env.NODE_ENV === 'development' && module['hot']
  const constructor = proxyStore.current && proxyStore.current.constructor
  const hasChangedSource = constructor && constructor.toString() !== Store.toString()
  const shouldHMRStore = isHMRCompat && hasSetupStore && hasChangedSource
  const store = useStoreWithReactiveProps(Store, props, shouldHMRStore, options)
  // setup store once
  if (!proxyStore.current || shouldHMRStore) {
    if (shouldHMRStore) {
      console.log('HMRing store', Store)
    }
    proxyStore.current = store
  }

  return proxyStore.current
}

// TODO make safer by freezing after one set
export const configureUseStore = (opts: UseGlobalStoreOptions) => {
  globalOptions = {
    ...globalOptions,
    ...opts,
  }
}
