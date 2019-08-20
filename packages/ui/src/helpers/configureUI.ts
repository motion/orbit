import { isColorLike, toColor, toColorString } from '@o/color'
import { fromEntries, idFn, ImmutableUpdateFn, isDefined, selectDefined } from '@o/utils'
import { configureCSS, configureGloss } from 'gloss'
import sum from 'hash-sum'
import { Context, createContext, FunctionComponent, isValidElement, useState } from 'react'

import { ListItemProps } from '../lists/ListItem'
import { ListItemViewProps } from '../lists/ListItemViewProps'
import { SimpleTextProps } from '../text/SimpleText'
import { TitleProps } from '../text/Title'
import { Bit } from './BitLike'

// TODO duplicate of kit definition
type PersistedStateOptions = {
  persist?: 'off'
}

export type ConfigureUIProps = {
  // configure a custom icon for all surfaces
  // this could be made generic for any part of the ui kit to override
  useIcon: any

  getIconForBit: (bit: Bit) => React.ReactNode

  // set a custom item key getter for lists/tables
  getItemKey: (item: any, index: number) => string | number

  handleLink: (event: Event, url: string) => any

  // set a custom persistence function for appState
  useAppState: <A>(
    id: string | false,
    defaultState: A,
    options?: PersistedStateOptions,
  ) => [A, ImmutableUpdateFn<A>]

  // set a custom persistence function for userState
  useUserState: <A>(
    id: string | false,
    defaultState: A,
    options?: PersistedStateOptions,
  ) => [A, ImmutableUpdateFn<A>]

  // you can control how list items and bits render
  customItems: {
    // maps Bit.contentType to a custom view
    [key: string]: CustomItemDescription
  }

  // (INTERNAL) use your own store context
  StoreContext: Context<any>

  // helpful for custom fonts, etc
  defaultProps: {
    title?: Partial<TitleProps> | null
    text?: Partial<SimpleTextProps> | null
  }

  loadBit?: (id: number) => Promise<Bit>
}

export type CustomItemView = FunctionComponent<ListItemViewProps & { item: Bit }>
export type CustomItemDescription = {
  listItem?: CustomItemView
  item?: CustomItemView
  getItemProps?: (item: Bit) => ListItemProps
}

// safe for react components
const hash = x =>
  sum(
    fromEntries(
      Object.entries(x).map(x => (isValidElement(x[1] as any) ? [x[0], (x[1] as any).key] : x)),
    ),
  )

let hasSet = false

export let Config: ConfigureUIProps = {
  useIcon: null,
  getIconForBit: bit => bit.appIdentifier,
  defaultProps: {},
  customItems: {},

  // used to configure how the UI persists non-temporal state
  useUserState: useState,
  useAppState: useState,
  handleLink: idFn,

  StoreContext: createContext(null),
  getItemKey: (x, index) => {
    if (!x) {
      console.warn('NO ITEM', x)
      return selectDefined(index, `${Math.random()}`)
    }
    const item = x.item || x
    const key = item.id || item.key || item.identifier
    if (isDefined(key)) {
      return `${key}`
    }
    if (typeof index === 'undefined') {
      return `${hash(x)}`
    }
    return index
  },
}

export function configureUI(opts: Partial<ConfigureUIProps>) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true

  Object.assign(Config, opts)

  configureCSS({
    isColor: isColorLike,
    toColor: toColorString,
  })

  configureGloss({
    toColor: toColor,
  })
}

if (typeof module !== 'undefined' && module.hot) {
  module.hot.accept(() => {
    if (module.hot) {
      Config = module.hot.data || Config
    }
  })
  module.hot.dispose(_ => {
    _.data = Config
  })
}
