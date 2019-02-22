import { Context, createContext } from 'react'
import { KitStores } from './stores'

let hasSet = false

type ConfigureOpts = {
  StoreContext?: Context<KitStores>
  sources: { allSources: any }
}

export let config: ConfigureOpts = {
  StoreContext: createContext(null),
  sources: null,
}

export function configureKit(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(config, opts)
}
