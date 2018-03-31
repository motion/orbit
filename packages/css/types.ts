type NoS = number | string

export type CSSArray = Array<NoS>

export type ColorObject = { r: NoS; g: NoS; b: NoS; a?: NoS }

export type NiceColor = string | CSSArray | ColorObject

export type ToCSSAble = { toCSS: Function } | { css: Function }

export type Color = ToCSSAble | NiceColor

export type Transform = {
  x: number | string
  y: number | string
  z: number | string
}
