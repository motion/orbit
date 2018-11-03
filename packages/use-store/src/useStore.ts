import { automagicClass } from '@mcro/automagical'
import { isValidElement, useState, useEffect, useRef, createContext } from 'react'
import { action, autorun, observable } from 'mobx'
const isEqualReact = (a, b) => a && b
const difference = (a, b) => a && b

let options = {
  onMount: null,
  onUnmount: null,
  context: createContext(null),
}

const updateProps = (props, nextProps) => {
  const nextPropsKeys = Object.keys(nextProps).filter(x => isValidElement(nextProps[x]))
  const curPropKeys = Object.keys(props)
  // change granular so reactions are granular
  for (const prop of nextPropsKeys) {
    // this is the actual comparison
    const a = props[prop]
    const b = nextProps[prop]
    const isSame = a === b
    const isSameReact = isValidElement(a) && isEqualReact(a, b)
    const hasChanged = !(isSame || isSameReact)
    if (hasChanged) {
      console.log('has changed prop', prop, nextProps[prop])
      props[prop] = nextProps[prop]
    }
  }
  // remove
  for (const extraProp of difference(curPropKeys, nextPropsKeys)) {
    props[extraProp] = undefined
  }
}

const setupStoreWithReactiveProps = (Store, props?) => {
  if (props) {
    const updatePropsAction = action(`${Store.name}.updateProps`, updateProps)
    const storeProps = observable(
      {
        props: props,
      },
      { props: observable.shallow },
    )
    const getProps = {
      configurable: true,
      get: () => storeProps.props,
      set() {},
    }
    Store.prototype.automagic = automagicClass
    Object.defineProperty(Store.prototype, 'props', getProps)
    const storeInstance = new Store()
    Object.defineProperty(storeInstance, 'props', getProps)
    storeInstance.automagic({
      isSubscribable: x => x && typeof x.subscribe === 'function',
    })
    storeInstance.__updateProps = updatePropsAction
    return storeInstance
  } else {
    const storeInstance = new Store()
    storeInstance.automagic({
      isSubscribable: x => x && typeof x.subscribe === 'function',
    })
    return storeInstance
  }
}

const useStoreWithReactiveProps = (Store, props?, shouldHMR = false) => {
  let store = useRef(null)
  if (!store.current || shouldHMR) {
    // @ts-ignore
    store.current = setupStoreWithReactiveProps(Store, props)
  }
  useEffect(() => {
    if (props) {
      store.current.__updateProps(store.current.props, props)
    }
    return () => {}
  })
  return store.current
}

export const useStore = <A>(Store: new () => A, props: Object): A => {
  const proxyStore = useRef(null)
  const isHMRCompat = process.env.NODE_ENV === 'development' && module['hot']
  const shouldReloadStore =
    isHMRCompat &&
    proxyStore.current &&
    proxyStore.current.constructor.toString() !== Store.toString()
  const store = useStoreWithReactiveProps(Store, props, shouldReloadStore)
  const hasTrackedKeys = useRef(false)
  const dispose = useRef(null)
  const reactiveKeys = useRef({})
  const update = useState(0)[1]

  if (!proxyStore.current || shouldReloadStore) {
    if (shouldReloadStore) {
      console.log('HMRing store', Store.name)
    }
    // @ts-ignore
    proxyStore.current = new Proxy(store, {
      get(obj, key) {
        if (!hasTrackedKeys.current) {
          reactiveKeys.current[key] = true
        }
        return obj[key]
      },
    })
  }

  // untrack after the first render
  useEffect(() => {
    return () => {
      // @ts-ignore
      hasTrackedKeys.current = true
    }
  })

  // one effect to then run and watch the keys we track from the first one
  useEffect(() => {
    if (options.onMount) {
      options.onMount(store)
    }
    if (!dispose.current) {
      // @ts-ignore
      dispose.current = autorun(() => {
        for (const key in reactiveKeys.current) {
          store[key]
        }
        update(Math.random())
      })
    }
    return () => {
      if (options.onUnmount) {
        options.onUnmount(store)
      }
      dispose.current()
    }
  }, [])

  return proxyStore.current
}

export const configureUseStore = (opts: typeof options) => {
  options = {
    ...options,
    ...opts,
  }
}
