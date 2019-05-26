import { AppDefinition } from '@o/models'
import { Context, createContext } from 'react'

import { KitStores } from './stores'

type ConfigureOpts = {
  StoreContext?: Context<KitStores>
  handleLink?: (url: string) => void
  getLoadedApps: () => AppDefinition[]
}

export let config: ConfigureOpts = {
  StoreContext: createContext(null),
  handleLink: path => window.history.pushState(null, '', path),
  getLoadedApps: null,
}

export function configureKit(opts: ConfigureOpts) {
  Object.assign(config, opts)
  // for HMR we need to update views as they change
  if (process.env.NODE_ENV !== 'development') {
    Object.freeze(config)
  }
}
