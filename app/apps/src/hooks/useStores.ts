import { createUseStores, UseStoresOptions } from '@mcro/use-store'
import { useContext } from 'react'
import { config } from '../configureApps'
import { AppsStores } from '../stores'

// internal just for apps

let useStoresResolved = null

type GuaranteedUIStores = { [P in keyof AppsStores]-?: AppsStores[P] }

// wrap around useStores, just lets use config the context before running this

export function useStores<A extends Object>(options?: UseStoresOptions<A>): GuaranteedUIStores {
  if (!useStoresResolved) {
    useStoresResolved = createUseStores(config.StoreContext as React.Context<GuaranteedUIStores>)
  }
  return useStoresResolved(options)
}

export const useStoresSimple = () => useContext(config.StoreContext)
