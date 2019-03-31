import { Context, createContext } from 'react'

let hasSet = false

type ConfigureOpts = {
  useIcon?: any
  StoreContext?: Context<any>
  getItemKey?: (item: any, index: number) => string
}

export let Config: ConfigureOpts = {
  StoreContext: createContext(null),
  getItemKey: (x, index) => {
    if (!x) {
      debugger
    }
    const item = x.item || x
    return `${item.id || item.email || item.key || index}`
  },
}

export function configureUI(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(Config, opts)
}
