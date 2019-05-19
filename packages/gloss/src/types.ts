import { ThemeObject } from '@o/css'

export type Psuedos = '&:hover' | '&:active' | '&:focus'

export type GlossOptions = {
  toColor: Function
  isColor: Function
  pseudoAbbreviations?: { [key: string]: Psuedos }
  preProcessTheme?: (props: any, theme: ThemeObject) => ThemeObject
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

// helpful for themes

export type NoS = number | string
export type ColorArray = NoS[]
export type ColorObject = { r: NoS; g: NoS; b: NoS; a?: NoS }
export type ColorClassLike = { toCSS: Function } | { css: Function } | { alpha: Function }
export type ColorLike = string | ColorClassLike | ColorArray | ColorObject

export type SimpleStyleObject = {
  color?: ColorLike
  background?: ColorLike
  borderColor?: ColorLike
  [a: string]: ColorLike | ColorObject | any
}

export type StrictOptions = {
  displayName: boolean
  evaluate: boolean
  ignore: RegExp
  babelOptions: Object
}
