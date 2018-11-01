import { isValidElement, useContext, useState, useEffect, useRef } from 'react'
import { action, autorun, observable } from 'mobx'
const isEqualReact = (a, b) => a && b
const difference = (a, b) => a && b

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
    Object.defineProperty(Store.prototype, 'props', getProps)
    const storeInstance = new Store()
    Object.defineProperty(storeInstance, 'props', getProps)
    storeInstance.__updateProps = updatePropsAction
    storeInstance.__props = storeProps
    console.log('set current...')
    // @ts-ignore
    store.current = storeInstance
  }
  useEffect(() => {
    store.current.__updateProps(store.current.__props, props)
  })
  return store.current
}

export const useStore = <A>(Store: new () => A, keys: Array<keyof A>, props: Object): A => {
  const store = useStoreWithReactiveProps(Store, props)
  const setState = useState(0)[1]
  useEffect(() => {
    return autorun(() => {
      for (const key of keys) {
        store[key]
      }
      console.log('update state...', store)
      setState(Math.random())
    })
  }, [])
  return store
}

export const useParentStore = <A>(Store: new () => A, keys: Array<keyof A>): A => {
  const store = useContext(Store)
  const setState = useState(0)[1]
  useEffect(() =>
    autorun(() => {
      for (const key of keys) {
        store[key]
      }
      setState(Math.random())
    }),
  )
  return store
}
