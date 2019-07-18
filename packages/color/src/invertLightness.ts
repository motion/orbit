import { Color } from './color'

export const invertLightness = (color: Color, percent: number) => {
  const lightness = color.getLuminance()
  if (lightness === 50) {
    return color
  }
  if (percent < 0) {
    throw new Error('Percent should be a positive value')
  }
  const isLight = lightness > 50
  const direction = isLight ? -1 : 1
  const diff = Math.abs(lightness - 50) * percent
  return color.lighten(lightness + direction * diff)
}
