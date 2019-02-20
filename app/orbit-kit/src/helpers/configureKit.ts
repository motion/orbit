import { Context, createContext } from 'react'

let hasSet = false

type ConfigureOpts = {
  StoreContext?: Context<any>
}

export let configure: ConfigureOpts = {
  StoreContext: createContext(null),
}

export function configureKit(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(configure, opts)
}
