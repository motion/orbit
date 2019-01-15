import { AllStores, StoreContext } from '../contexts'
import { useContext, useMemo } from 'react'

type GuaranteedAllStores = { [P in keyof AllStores]-?: AllStores[P] }

type UseStoresOptions = {
  optional?: (keyof AllStores)[]
}

const objToArray = (obj: Object) => {
  const arr = []
  for (const key in obj) {
    arr.push(obj[key])
  }
  return arr
}

export function useStoresSafe(options?: UseStoresOptions) {
  const stores = useContext(StoreContext) as GuaranteedAllStores
  const safeStores = useMemo(() => {
    // this will throw if they try and access a store thats not provided
    // should give us runtime safety without as much type overhead everywhere
    return new Proxy(stores, {
      get(target, key) {
        const val = Reflect.get(target, key)
        if (typeof val !== 'undefined') {
          return val
        }
        if (typeof key === 'string') {
          if (options && options.optional && options.optional.find(x => x === key)) {
            return
          }
          if (process.env.NODE_ENV === 'develoopment') {
            console.debug(`Attempted to get store ${String(key)} which is not in context`)
          }
        }
      },
    })
  }, objToArray(stores))

  return safeStores
}
