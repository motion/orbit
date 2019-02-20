import { createUseStores, UseStoresOptions } from '@mcro/use-store'
import { useContext } from 'react'
import { configure } from './configureKit'
import { KitStores } from './KitStores'

// internal just for kit

let useStoresResolved = null

type GuaranteedUIStores = { [P in keyof KitStores]-?: KitStores[P] }

// wrap around useStores, just lets use configure the context before running this

export function useStores<A extends Object>(options?: UseStoresOptions<A>): GuaranteedUIStores {
  if (!useStoresResolved) {
    useStoresResolved = createUseStores(configure.StoreContext as React.Context<GuaranteedUIStores>)
  }
  return useStoresResolved(options)
}

export const useStoresSimple = () => useContext(configure.StoreContext)
