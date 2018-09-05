import * as React from 'react'

const defaultValue = {
  item: {},
  text: {},
}

export type ItemResolverDecoration = typeof defaultValue
export const ItemResolverDecorationContext = React.createContext(defaultValue)
