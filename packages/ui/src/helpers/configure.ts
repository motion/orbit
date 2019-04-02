import sum from 'hash-sum'
import { Context, createContext } from 'react'

let hasSet = false

type ConfigureOpts = {
  useIcon?: any
  StoreContext?: Context<any>
  getItemKey?: (item: any) => string
}

const KeyCache = new WeakMap<Object, string>()

export let Config: ConfigureOpts = {
  StoreContext: createContext(null),
  getItemKey: x => {
    if (!x) {
      console.warn('NO ITEM', x)
      return `${Math.random()}`
    }
    const item = x.item || x
    const key = item.id || item.email || item.key
    if (key) {
      return `${key}`
    }
    let backupKey = KeyCache.get(x)
    if (backupKey) {
      return backupKey
    }
    backupKey = `${sum(x)}${Math.random()}`
    KeyCache.set(x, backupKey)
    return backupKey
  },
}

export function configureUI(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(Config, opts)
}
