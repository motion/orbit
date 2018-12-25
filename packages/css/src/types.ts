export type CSSOptions = {
  toColor: (a: any) => string
  isColor: (a: any) => boolean
}

export type NoS = number | string

export type CSSArray = Array<NoS>

export type ColorObject = { r: NoS; g: NoS; b: NoS; a?: NoS }

export type NiceColor = string | CSSArray | ColorObject

export type ToCSSAble = { toCSS: Function } | { css: Function } | { alpha: Function } | any

export type Color = ToCSSAble | NiceColor

export type Transform = {
  x: number | string
  y: number | string
  z: number | string
}

export type ThemeObject = {
  background: Color
  color: Color
  borderColor: Color
  backgroundBlur?: Color
  colorBlur?: Color
  borderColorBlur?: Color
  backgroundHover?: Color
  colorHover?: Color
  borderColorHover?: Color
  backgroundFocus?: Color
  colorFocus?: Color
  borderColorFocus?: Color
  backgroundActive?: Color
  colorActive?: Color
  borderColorActive?: Color
  backgroundActiveHighlight?: Color
  colorActiveHighlight?: Color
  borderColorActiveHighlight?: Color
  [key: string]: Color
}
