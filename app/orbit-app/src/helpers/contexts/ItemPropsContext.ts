import { TextProps, ViewProps } from '@mcro/ui'
import { createContext } from 'react'
import { ContextValueOf } from '../../types'

export const ItemPropsContext = createContext({
  oneLine: false,
  condensed: false,
  preventSelect: false,
  beforeTitle: null,
  itemProps: null as ViewProps,
  textProps: null as TextProps,
})

export type ItemsPropsContextType = ContextValueOf<typeof ItemPropsContext>
