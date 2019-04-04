import { createContext } from 'react'
import { TextProps } from '../text/Text'
import { ViewProps } from '../View/View'

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
