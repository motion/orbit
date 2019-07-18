import { Color, ColorInput } from './color'
import { ColorLike } from './types'

export { Color } from './color'
export { isColorLike, toColorString } from './isColor'
export * from './linearGradient'
export { ColorArray, ColorLike } from './types'

export * from './css-color-names'
export * from './readability'
export * from './to-ms-filter'
export * from './from-ratio'
export * from './format-input'
export * from './random'
export * from './interfaces'

export function toColor(obj: ColorInput | ColorLike) {
  return new Color(obj as any)
}
