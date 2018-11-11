import { automagicClass } from '@mcro/automagical'
import {
  isValidElement,
  useState,
  useEffect,
  useRef,
  createContext,
  useMutationEffect,
} from 'react'
import { action, autorun, observable, toJS, trace } from 'mobx'
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
  for (const prop of nextPropsKeys) {
    const a = props[prop]
    const b = nextProps[prop]
    if (a !== b) {
      // this is a bit risky and weird but i cant think of a case it would ever have broken
      // if you use functions as render callbacks and then *change* them during renders this would break
      if (typeof a === 'function' && typeof b === 'function') {
        if (a.toString() === b.toString()) {
          console.log('skip update on similar function', a, b)
          continue
        }
      }
      if (!isEqual(a, b)) {
        if (true || (process.env.NODE_ENV === 'development' && options && options.debug)) {
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
}

const setupStoreWithReactiveProps = (Store, props?) => {
  if (props) {
    const updatePropsAction = action(`${Store.name}.updateProps`, updateProps)
    const storeProps = observable({ props }, { props: observable.shallow })
    const getProps = {
      configurable: true,
      get: () => storeProps.props,
      set() {},
    }
    Store.prototype.automagic = automagicClass
    Object.defineProperty(Store.prototype, 'props', getProps)
    const storeInstance = new Store()
    Object.defineProperty(storeInstance, 'props', getProps)
    if (globalOptions.onMount) {
      globalOptions.onMount(storeInstance)
    }
    storeInstance.automagic({
      isSubscribable: x => x && typeof x.subscribe === 'function',
    })
    storeInstance.__updateProps = updatePropsAction
    return storeInstance
  } else {
    Store.prototype.automagic = automagicClass
    const storeInstance = new Store()
    storeInstance.automagic({
      isSubscribable: x => x && typeof x.subscribe === 'function',
    })
    return storeInstance
  }
}

const useStoreWithReactiveProps = (Store, props, shouldHMR = false, options?: UseStoreOptions) => {
  let store = useRef(null)
  const shouldSetupStore = !store.current || shouldHMR
  if (shouldSetupStore) {
    store.current = setupStoreWithReactiveProps(Store, props)
  }
  // only update props after first run
  if (props && !shouldSetupStore) {
    console.log('update props', Store.name, props)
    store.current.__updateProps(store.current.props, props, options)
  }
  return store.current
}

const ignoreReactiveKeys = {
  isMobXComputedValue: true,
  __IS_DEEP: true,
  IS_AUTO_RUN: true,
  $$typeof: true,
}

export const useStore = <A>(Store: new () => A, props?: Object, options?: UseStoreOptions): A => {
  if (options && options.conditionalUse === false) {
    return null
  }
  const proxyStore = useRef(null)
  const hasSetupStore = !!proxyStore.current
  const isHMRCompat = process.env.NODE_ENV === 'development' && module['hot']
  const shouldReloadStore =
    isHMRCompat && hasSetupStore && proxyStore.current.constructor.toString() !== Store.toString()
  const store = useStoreWithReactiveProps(Store, props, shouldReloadStore, options)
  const dispose = useRef(null)
  const reactiveKeys = useRef({
    hasRunOnce: false,
    lastKeys: [],
    keys: [],
    shouldTrack: true,
    update: observable.box(0),
  })
  const triggerUpdate = useState(0)[1]

  // setup store once
  if (!hasSetupStore || shouldReloadStore) {
    if (shouldReloadStore) {
      console.log('HMRing store', Store.name)
    }
    if (process.env.NODE_ENV === 'development') {
      store.__useStore = {
        get reactiveKeys() {
          return toJS(reactiveKeys.current)
        },
      }
    }
    proxyStore.current = new Proxy(store, {
      get(obj, key) {
        const { keys, shouldTrack } = reactiveKeys.current
        if (!ignoreReactiveKeys[key]) {
          if (shouldTrack && typeof key === 'string') {
            if (!keys[key]) {
              if (process.env.NODE_ENV === 'development' && options && options.debug) {
                console.log(`new reactive key: ${Store.name}.${key}`)
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
    const rk = reactiveKeys.current
    rk.shouldTrack = false
    // trigger update if keys changed
    for (const [index, key] of rk.lastKeys.entries()) {
      if (key !== rk.keys[index]) {
        console.log('set new key', key)
        rk.update.set(Math.random())
        break
      }
    }
    reactiveKeys.current = rk
    return () => {
      rk.lastKeys = rk.keys
      rk.shouldTrack = true
      reactiveKeys.current = rk
    }
  })

  // one effect to then run and watch the keys we track from the first one
  useEffect(() => {
    if (!dispose.current) {
      dispose.current = autorun(() => {
        const rk = reactiveKeys.current

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
          trace()
          console.log('trigger update')
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

// TODO make safer by freezing after one set
export const configureUseStore = (opts: UseGlobalStoreOptions) => {
  globalOptions = {
    ...globalOptions,
    ...opts,
  }
}
