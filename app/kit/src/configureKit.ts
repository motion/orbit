import { AppDefinition } from '@o/models'
import { Context } from 'react'

import { KitStores } from './stores'

type ConfigureOpts = {
  StoreContext?: Context<KitStores> | null
  handleLink?: (url: string) => void
  getLoadedApps: (() => AppDefinition[]) | null
}

export let config: ConfigureOpts = {
  StoreContext: null,
  handleLink: path => window.history.pushState(null, '', path),
  getLoadedApps: null,
}

export function configureKit(opts: ConfigureOpts) {
  Object.assign(config, opts)
  // kit is always in prod mode but still needs hmr support, so just allow unlimited setting
  // for HMR we need to update views as they change
  // if (process.env.NODE_ENV !== 'development') {
  //   Object.freeze(config)
  // }
}
