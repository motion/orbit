export type Options = {
  dontTheme?: boolean
  glossProp?: string
  tagName?: string
  toColor?: Function
  isColor?: Function
  parentStylesOverride?: boolean
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
