import { Context, createContext } from 'react'
import { AppsStores } from './hooks/AppsStores'

let hasSet = false

type ConfigureOpts = {
  StoreContext?: Context<AppsStores>
}

export let config: ConfigureOpts = {
  StoreContext: createContext(null),
}

export function configureApps(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(config, opts)
}
