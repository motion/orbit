import { AllStores, StoreContext } from '../contexts'
import { useContext } from 'react'

type GuaranteedAllStores = { [P in keyof AllStores]-?: AllStores[P] }

type UseStoresOptions = {
  optional?: (keyof AllStores)[]
}

export function useStoresSafe(options?: UseStoresOptions) {
  const stores = useContext(StoreContext) as GuaranteedAllStores

  // this will throw if they try and access a store thats not provided
  // should give us runtime safety without as much type overhead everywhere
  return new Proxy(stores, {
    get(target, key) {
      const val = Reflect.get(target, key)
      if (typeof val !== 'undefined') {
        return val
      }
      if (typeof key === 'string') {
        if (key.indexOf('isMobX') === 0) {
          return
        }
        if (options && options.optional && options.optional.find(x => x === key)) {
          return
        }
        throw new Error(`Attempted to get store ${String(key)} which is not in context`)
      }
    },
  })
}
