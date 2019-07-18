import { Color, ColorInput } from './color'
import { ColorLike } from './types'

// exports
export { Color } from './color'
export * from './invertLightness'
export { isColorLike, toColorString } from './isColor'
export * from './linearGradient'
export { ColorArray, ColorLike } from './types'

export function toColor(obj: ColorInput | ColorLike) {
  return new Color(obj as any)
}

export * from './css-color-names'
export * from './readability'
export * from './to-ms-filter'
export * from './from-ratio'
export * from './format-input'
export * from './random'
export * from './interfaces'

// kept for backwards compatability with v1
export default toColor
