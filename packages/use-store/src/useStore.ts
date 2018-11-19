import { automagicClass } from '@mcro/automagical'
import {
  isValidElement,
  useState,
  useEffect,
  useRef,
  createContext,
  useMutationEffect,
} from 'react'
import { autorun, observable, toJS, trace, transaction } from 'mobx'
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

const ignorestate = {
  isMobXComputedValue: true,
  __IS_DEEP: true,
  IS_AUTO_RUN: true,
  $$typeof: true,
}

let globalOptions = {
  onMount: null,
  onUnmount: null,
  context: createContext(null),
}

const isReactElement = x => {
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

const propKeysWithoutElements = props => Object.keys(props).filter(x => !isReactElement(props[x]))

// updateProps
// granular set so reactions can be efficient
const updateProps = (props, nextProps, options?: UseStoreOptions) => {
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

const setupStoreWithReactiveProps = (Store, props?) => {
  Store.prototype.automagic = automagicClass
  let storeInstance
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
    storeInstance.__updateProps = updateProps
  }
  if (globalOptions.onMount) {
    globalOptions.onMount(storeInstance)
  }
  storeInstance.automagic({
    isSubscribable: x => x && typeof x.subscribe === 'function',
  })
  return storeInstance
}

const useStoreWithReactiveProps = (Store, props, shouldHMR = false, options?: UseStoreOptions) => {
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

export function useInstantiatedStore<A>(
  plainStore: A,
  options?: UseStoreOptions,
  props?: Object,
  shouldSetup?: boolean,
): A {
  if (options && options.conditionalUse === false) {
    return null
  }
  const proxyStore = useRef(null)
  const hasSetupStore = !proxyStore.current
  const isHMRCompat = process.env.NODE_ENV === 'development' && module['hot']
  const constructor = proxyStore.current && proxyStore.current.constructor
  const hasChangedSource = constructor && constructor.toString() !== plainStore.toString()
  const shouldHMRStore = isHMRCompat && hasSetupStore && hasChangedSource
  const store = shouldSetup
    ? useStoreWithReactiveProps(plainStore, props, shouldHMRStore, options)
    : plainStore
  const dispose = useRef(null)
  const state = useRef({
    hasRunOnce: false,
    lastKeys: [],
    keys: [],
    shouldTrack: true,
    update: observable.box(0),
  })
  const triggerUpdate = useState(0)[1]

  // setup store once
  if (!proxyStore.current || shouldHMRStore) {
    if (shouldHMRStore) {
      console.log('HMRing store', plainStore)
    }
    if (process.env.NODE_ENV === 'development') {
      store.__useStore = {
        get state() {
          return toJS(state.current)
        },
      }
    }
    proxyStore.current = new Proxy(store, {
      get(obj, key) {
        const { keys, shouldTrack } = state.current
        if (!ignorestate[key]) {
          if (shouldTrack && typeof key === 'string') {
            if (!keys[key]) {
              if (process.env.NODE_ENV === 'development' && options && options.debug) {
                console.log(`new reactive key: ${plainStore['name']}.${key}`)
              }
              keys[key] = true
            }
          }
        }
        return obj[key]
      },
    })
  }

  // this may "look" backward but because useEffect fires on finished render
  // this is what we want: stop tracking on finished render
  // start tracking again after that (presumable before next render, but not 100%)
  useMutationEffect(() => {
    const rk = state.current
    rk.shouldTrack = false
    // trigger update if keys changed
    for (const [index, key] of rk.lastKeys.entries()) {
      if (key !== rk.keys[index]) {
        rk.update.set(Math.random())
        break
      }
    }
    state.current = rk
    return () => {
      rk.lastKeys = rk.keys
      rk.shouldTrack = true
      state.current = rk
    }
  })

  // one effect to then run and watch the keys we track from the first one
  useEffect(() => {
    if (!dispose.current) {
      dispose.current = autorun(() => {
        const rk = state.current

        // listen for key changes
        rk.update.get()

        // trigger reaction on keys
        for (const key in rk.keys) {
          store[key]
        }

        if (process.env.NODE_ENV === 'development' && options && options.debug) {
          trace()
        }

        // update when we react, ignore first run
        if (rk.hasRunOnce) {
          triggerUpdate(Math.random())
        }

        rk.hasRunOnce = true
      })
    }

    return () => {
      // emit unmount
      if (globalOptions.onUnmount) {
        globalOptions.onUnmount(store)
      }
      // stop autorun()
      dispose.current()
    }
  }, [])

  return proxyStore.current
}

// this lets you react to observable properties of a store within a render
// if the store isn't instantiated yet, we instantiate it and attach any props to it
// if the store is instantiated, we just listen for keys to react to
export function useStore<A>(Store: new () => A, props?: Object, options?: UseStoreOptions): A {
  return useInstantiatedStore(Store as any, options, props, true)
}

// TODO make safer by freezing after one set
export const configureUseStore = (opts: UseGlobalStoreOptions) => {
  globalOptions = {
    ...globalOptions,
    ...opts,
  }
}
