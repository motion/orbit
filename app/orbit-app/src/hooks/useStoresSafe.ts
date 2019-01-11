import { AllStores, StoreContext } from '../contexts'
import { useContext } from 'react'

type GuaranteedAllStores = { [P in keyof AllStores]-?: AllStores[P] }

export function useStoresSafe() {
  const stores = useContext(StoreContext) as GuaranteedAllStores

  // this will throw if they try and access a store thats not provided
  // should give us runtime safety without as much type overhead everywhere
  return new Proxy(stores, {
    get(target, key) {
      const val = Reflect.get(target, key)
      if (val) {
        return val
      }
      if (typeof key === 'string') {
        throw new Error(`Attempted to get store ${String(key)} which is not in context`)
      }
    },
  })
}
