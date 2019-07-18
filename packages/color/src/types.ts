import { Color } from './color'

export type NoS = number | string
export type ColorArray = NoS[]
export type ColorObject = { r: NoS; g: NoS; b: NoS; a?: NoS }
export type ColorClassLike = { toCSS: Function }
export type ColorLike = string | ColorClassLike | ColorArray | ColorObject | Color
