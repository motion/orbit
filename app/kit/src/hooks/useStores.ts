import { createUseStores, resetTracking, UseStoresOptions } from '@o/use-store'
import { useContext } from 'react'
import { config } from '../configureKit'
import { KitStores } from '../stores'

// internal just for kit

let useStoresResolved = null

type GuaranteedUIStores = { [P in keyof KitStores]-?: KitStores[P] }

// wrap around useStores, just lets use config the context before running this

export function useStores<A extends Object>(options?: UseStoresOptions<A>): GuaranteedUIStores {
  if (!useStoresResolved) {
    useStoresResolved = createUseStores(config.StoreContext as React.Context<GuaranteedUIStores>)
  }
  return useStoresResolved(options)
}

export const useStoresSimple = () => {
  resetTracking()
  return useContext(config.StoreContext)
}
