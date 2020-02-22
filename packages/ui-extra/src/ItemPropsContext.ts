import { TextProps, ViewProps } from '@o/ui'
import { createContext } from 'react'

export type ItemRenderText = (text: string) => JSX.Element
export const ItemPropsContext = createContext({
  oneLine: false,
  preventSelect: false,
  beforeTitle: null,
  itemProps: null as ViewProps | null,
  textProps: null as TextProps | null,
  renderText: null as ItemRenderText | null,
})

type ContextValueOf<S> = S extends React.Context<infer T> ? T : never

export type ItemsPropsContextType = ContextValueOf<typeof ItemPropsContext>
