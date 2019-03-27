import { createUseStores, UseStoresOptions } from '@o/use-store'
import { useContext } from 'react'
import { UIStores } from '../UIStores'
import { configure } from './configure'

let useStoresResolved = null

type GuaranteedUIStores = { [P in keyof UIStores]-?: UIStores[P] }

// wrap around useStores, just lets use configure the context before running this

export function useStores<A extends Object>(options?: UseStoresOptions<A>): A {
  if (!useStoresResolved) {
    useStoresResolved = createUseStores(configure.StoreContext as React.Context<GuaranteedUIStores>)
  }
  return useStoresResolved(options)
}

export const useStoresSimple = () => {
  return useContext(configure.StoreContext) || {}
}
