import { ViewProps } from '@o/gloss'
import { createContext } from 'react'
import { TextProps } from '../text/Text'

export const ItemPropsContext = createContext({
  oneLine: false,
  condensed: false,
  preventSelect: false,
  beforeTitle: null,
  itemProps: null as ViewProps,
  textProps: null as TextProps,
  renderText: null,
})

type ContextValueOf<S> = S extends React.Context<infer T> ? T : never

export type ItemsPropsContextType = ContextValueOf<typeof ItemPropsContext>
