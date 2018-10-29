// @ts-ignore
import { isValidElement, useContext, useState, useEffect } from 'react'
import { action, autorun, extendObservable, observable } from 'mobx'
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

const useStoreWithProps = (Store, props) => {
  const updatePropsAction = action(`${Store.name}.updateProps`, updateProps)
  const storeProps = extendObservable(
    this,
    { _props: getNonReactElementProps(props) },
    { _props: observable.shallow },
  )
  const getProps = {
    configurable: true,
    get: () => storeProps,
    set() { /* ignore */ },
  }
  Object.defineProperty(Store.prototype, 'props', getProps)
  const store = new Store()
  Object.defineProperty(store, 'props', getProps)
  useEffect(() => {
    updatePropsAction(storeProps, props)
  })
  return store
}

export const useStore = <A>(Store: new () => A, keys: Array<keyof A>, props?): A => {
  const store = useStoreWithProps(Store, props)
  const setState = useState(0)[1]
  useEffect(() => autorun(() => {
    for (const key of keys) {
      store[key]
    }
    setState(Math.random())
  }))
  return store
}

export const useParentStore = <A>(Store: new () => A, keys: Array<keyof A>): A => {
  const store = useContext(Store)
  const setState = useState(0)[1]
  useEffect(() => autorun(() => {
    for (const key of keys) {
      store[key]
    }
    setState(Math.random())
  }))
  return store
}

// useStore
// useParentStore

class MyStore {
  state = 0
  otherState = 1
}

function MyView(props) {
  const { state } = useParentStore(MyStore, ['state'])
  const { otherState } = useStore(MyStore, ['otherState'], props)
  return (
    <div>
      {state} {otherState}
    </div>
  )
}
