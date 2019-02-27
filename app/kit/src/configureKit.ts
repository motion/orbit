import { Context, createContext } from 'react'
import { KitStores } from './stores'
import { AppDefinition } from './types/AppDefinition'

type ConfigureOpts = {
  StoreContext?: Context<KitStores>
  getApps: () => AppDefinition[]
}

export let config: ConfigureOpts = window['__orbitKitConfig'] || {
  StoreContext: createContext(null),
  getApps: null,
}

export function configureKit(opts: ConfigureOpts) {
  Object.assign(config, opts)
  // for HMR we need to update views as they change
  if (process.env.NODE_ENV !== 'development') {
    Object.freeze(config)
  }
}
