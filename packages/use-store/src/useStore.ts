import { automagicClass } from '@mcro/automagical'
import { isValidElement, useState, useEffect, useRef } from 'react'
import { action, autorun, observable } from 'mobx'
const isEqualReact = (a, b) => a && b
const difference = (a, b) => a && b

let options = {
  onMount: null,
  onUnmount: null,
}

const getNonReactElementProps = nextProps => {
  let props = {}
  for (const key of Object.keys(nextProps)) {
    if (isValidElement(nextProps[key])) {
      continue
    }
    props[key] = nextProps[key]
  }
  return props
}

const updateProps = (props, nextProps) => {
  const nextPropsFinal = getNonReactElementProps(nextProps)
  const curPropKeys = Object.keys(props)
  const nextPropsKeys = Object.keys(nextPropsFinal)
  // change granular so reactions are granular
  for (const prop of nextPropsKeys) {
    // this is the actual comparison
    const a = props[prop]
    const b = nextPropsFinal[prop]
    const isSame = a === b
    const isSameReact = isValidElement(a) && isEqualReact(a, b)
    const hasChanged = !(isSame || isSameReact)
    if (hasChanged) {
      props[prop] = nextPropsFinal[prop]
    }
  }
  // remove
  for (const extraProp of difference(curPropKeys, nextPropsKeys)) {
    props[extraProp] = undefined
  }
}

const useStoreWithReactiveProps = (Store, props) => {
  let store = useRef(null)
  if (!store.current) {
    const updatePropsAction = action(`${Store.name}.updateProps`, updateProps)
    const storeProps = observable(
      {
        props: getNonReactElementProps(props),
      },
      { props: observable.shallow },
    )
    const getProps = {
      configurable: true,
      get: () => storeProps,
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
    storeInstance.__props = storeProps
    // @ts-ignore
    store.current = storeInstance
  }
  useEffect(() => {
    store.current.__updateProps(store.current.__props, props)
  })
  return store.current
}

export const useStore = <A>(Store: new () => A, props: Object): A => {
  const store = useStoreWithReactiveProps(Store, props)
  const proxyStore = useRef(null)
  const hasTrackedKeys = useRef(false)
  const dispose = useRef(null)
  const reactiveKeys = useRef({})
  const update = useState(0)[1]

  if (!proxyStore.current) {
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
  options = opts
}
