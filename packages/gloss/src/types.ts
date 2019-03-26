import { ThemeObject } from '@o/css'
import { GlossThemeFn } from './gloss'

export type Psuedos = '&:hover' | '&:active' | '&:focus'

export type GlossOptions = {
  tagName?: string
  toColor?: Function
  isColor?: Function
  pseudoAbbreviations?: { [key: string]: Psuedos }
  preProcessTheme?: (props: any, theme: ThemeObject) => ThemeObject
  defaultThemeFn?: GlossThemeFn<any>
}

type GlossViewConfig = {
  displayName?: string
}

export interface GlossView<T> {
  (props: Object): any
  theme?: Object
  style?: Object
  displayName?: string
  compiledStyles?: Object
  child?: GlossView<any>
  withConfig?: (a: GlossViewConfig) => T
  defaultProps?: Object
  tagName?: string
}
