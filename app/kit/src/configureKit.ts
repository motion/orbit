import { Context, createContext } from 'react'
import { KitStores } from './stores'
import { AppConfig } from './types/AppConfig'
import { OrbitListItemProps } from './views/ListItem'

let hasSet = false

type ConfigureOpts = {
  StoreContext?: Context<KitStores>
  getAppConfig(props: OrbitListItemProps, id?: string): AppConfig
}

export let config: ConfigureOpts = {
  StoreContext: createContext(null),
  getAppConfig: _ => ({}),
}

export function configureKit(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(config, opts)
}
