import { ThemeObject } from '@o/css'

export type Psuedos = '&:hover' | '&:active' | '&:focus'

export type GlossOptions = {
  toColor?: Function
  isColor?: Function
  pseudoAbbreviations?: { [key: string]: Psuedos }
  preProcessTheme?: (props: any, theme: ThemeObject) => ThemeObject
  preProcessStyles?: ((styles: Object) => Object) | undefined
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
