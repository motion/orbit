import { Context, createContext } from 'react'
import { KitStores } from './stores'
import { AppPackage } from './types/AppPackage'

let hasSet = false

type ConfigureOpts = {
  StoreContext?: Context<KitStores>
  getApps: () => AppPackage[]
}

export let config: ConfigureOpts = window['__orbitKitConfig'] || {
  StoreContext: createContext(null),
  getApps: null,
}

export function configureKit(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(config, opts)
  Object.freeze(config)
  window['__orbitKitConfig'] = config
}
