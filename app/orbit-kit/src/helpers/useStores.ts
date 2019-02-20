import { createUseStores, UseStoresOptions } from '@mcro/use-store'
import { KitStores } from '../KitStores'
import { configure } from './configureKit'

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
