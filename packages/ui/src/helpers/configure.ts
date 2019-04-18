import { fromEntries } from '@o/utils'
import sum from 'hash-sum'
import { Context, createContext, FunctionComponent, isValidElement, useState } from 'react'
import { ListItemProps } from '../lists/ListItem'
import { ListItemViewProps } from '../lists/ListItemViewProps'

export type ConfigureUIProps = {
  // configure a custom icon for all surfaces
  useIcon?: any

  // set a custom item key getter for lists/tables
  getItemKey?: (item: any) => string

  // set a custom persistence function for appState
  useAppState?: <A>(id: string, defaultState: A) => [A, (next: Partial<A>) => void]

  // set a custom persistence function for userState
  useUserState?: <A>(id: string, defaultState: A) => [A, (next: Partial<A>) => void]

  // you can control how list items and bits render
  customItems?: {
    // maps Bit.contentType to a custom view
    [key: string]: CustomItemDescription
  }

  // can be used for generically mapping an item in a table/list, back into something you prefer onSelect
  // TODO do the reverse (itemToProps)
  propsToItem: (props: any) => any

  // (INTERNAL) use your own store context
  StoreContext?: Context<any>
}

export type CustomItemView = FunctionComponent<ListItemViewProps>
export type CustomItemDescription = {
  listItem?: CustomItemView
  item?: CustomItemView
  getItemProps?: (item: any) => ListItemProps
}

// safe for react components
const hash = x =>
  sum(fromEntries(Object.entries(x).map(x => (isValidElement(x[1]) ? [x[0], x[1].key] : x))))

const KeyCache = new WeakMap<Object, string>()

let hasSet = false

export let Config: ConfigureUIProps = {
  customItems: {},

  propsToItem: x => x,

  // used to configure how the UI persists non-temporal state
  useUserState: useState,
  useAppState: useState,

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
    backupKey = `${hash(x)}`
    KeyCache.set(x, backupKey)
    return backupKey
  },
}

export function configureUI(opts: ConfigureUIProps) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(Config, opts)
}
