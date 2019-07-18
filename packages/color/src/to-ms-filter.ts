import { Color, ColorInput } from './color'
import { rgbaToArgbHex } from './conversion'

/**
 * Returns the color represented as a Microsoft filter for use in old versions of IE.
 */
export function toMsFilter(firstColor: ColorInput, secondColor?: ColorInput) {
  const color = new Color(firstColor)
  const hex8String = '#' + rgbaToArgbHex(color.r, color.g, color.b, color.a)
  let secondHex8String = hex8String
  const gradientType: string = color.gradientType ? 'GradientType = 1, ' : ''

  if (secondColor) {
    const s = new Color(secondColor)
    secondHex8String = '#' + rgbaToArgbHex(s.r, s.g, s.b, s.a)
  }

  return `progid:DXImageTransform.Microsoft.gradient(${gradientType}startColorstr=${hex8String},endColorstr=${secondHex8String})`
}
