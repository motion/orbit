import { Color, LinearGradient, toColor } from '@o/color'
import { SimpleStyleObject, ThemeObject } from 'gloss'

type Adjuster = (fn: Color) => number

export { ThemeObject } from 'gloss'

const darken = (color: Color, amt: Adjuster) => {
  return color.darken(amt(color))
}

export const increaseContrast = (color: Color, amt: Adjuster) => {
  const adjustAmt = amt(color)
  color = color.isLight() ? color.darken(adjustAmt) : color.lighten(adjustAmt)
  color = color.isLight() ? color.desaturate(adjustAmt) : color.saturate(adjustAmt)
  return color
}

export const decreaseContrast = (color: Color, amt: Adjuster) => {
  const adjustAmt = amt(color)
  color = color.isLight() ? color.lighten(adjustAmt) : color.darken(adjustAmt)
  color = color.isLight() ? color.saturate(adjustAmt) : color.desaturate(adjustAmt)
  return color
}

const roundToExtreme = (color: Color, pct = 20) => {
  const lightness = color.getLuminance()
  if (lightness <= pct) {
    return '#000'
  }
  if (lightness >= 100 - pct) {
    return '#fff'
  }
  return color
}

export const smallAmount = color => {
  // 1 = white, 1 = black, 0 = middle
  const ranged = Math.abs(50 / (50 - color.lightness()))
  // this is 0-0.025
  const small = (ranged + 0.001) * 0.025
  const softened = Math.log(2) - Math.log(2 - (0.1 - small))
  return softened * 1.8
}

export const largeAmount = color => smallAmount(color) * 1.25
export const xSmallAmount = color => smallAmount(color) * 0.75

const opposite = color => {
  return color.isDark()
    ? color.mix(color.lightness(10)).lightness(75)
    : color.mix(color.lightness(90)).lightness(25)
}

const isPlainObj = o => typeof o == 'object' && o.constructor == Object

export const colorize = (obj: SimpleStyleObject | ThemeObject): ThemeObject => {
  const res: Partial<ThemeObject> = {}
  for (const key in obj) {
    const val = obj[key]
    if (val instanceof LinearGradient) {
      res[key] = val
      continue
    }
    if (isPlainObj(val)) {
      // recurse into objects
      res[key] = colorize(val)
    } else {
      try {
        res[key] = toColor(val)
      } catch {
        res[key] = val
      }
    }
  }
  return res as ThemeObject
}

export const fromColor = (bgName: string): ThemeObject | null => {
  if (typeof bgName !== 'string') {
    return null
  }
  let background: Color
  try {
    background = toColor(bgName)
  } catch (e) {
    if (e.message.indexOf('parse color from string') > -1) {
      return null
    }
    throw e
  }
  return fromStyles({ background })
}

// generate some properly contrasted colors based on base colors
// insert theme into psuedo styles for Blur Active and ActiveHighlight
export const fromStyles = <A extends Partial<SimpleStyleObject>>(s: A): ThemeObject & A => {
  if (!s.background && !s.color) {
    throw new Error('Themes require at least background or color')
  }
  const backgroundColored = s.background
    ? toColor((s as any).background)
    : opposite(toColor((s as any).color!))
  // some handy basic styles
  const base = colorize({
    background: backgroundColored,
    color: s.color || roundToExtreme(decreaseContrast(opposite(backgroundColored), largeAmount)),
    borderColor: s.borderColor || increaseContrast(backgroundColored, smallAmount),
  }) as {
    background: Color
    color: Color
    borderColor: Color
  }

  const baseColor = toColor(base.color)

  const backgroundHover = base.background.lighten(base.background.isLight() ? 0.1 : 0.15)

  const res: ThemeObject = {
    ...colorize({
      // for buttons/surfaces, we generate a nice set of themes
      colorHover: s.colorHover || baseColor.lighten(0.1),
      backgroundHover: s.backgroundHover || backgroundHover,
      borderColorHover: s.borderColorHover || increaseContrast(base.borderColor, smallAmount),
      backgroundActiveHover:
        s.backgroundActiveHover || increaseContrast(base.background, largeAmount),
      backgroundActive: s.backgroundActive || decreaseContrast(base.background, largeAmount),
      borderColorActive: s.borderColorActive || decreaseContrast(base.borderColor, smallAmount),
      backgroundBlur: s.backgroundBlur || darken(base.background, largeAmount),
      colorBlur: s.colorBlur || darken(base.color, largeAmount),
      borderColorBlur: s.borderColorBlur || darken(base.borderColor, largeAmount),
      // focus is not desirable for many things...
      // backgroundFocus: s.backgroundFocus || decreaseContrast(base.background, largeAmount),
      // borderColorFocus: s.borderColorFocus || decreaseContrast(base.borderColor, largeAmount),
      // ensure rest is last so they can override anything

      backgroundDisabled: backgroundColored.desaturate(0.85).setAlpha(0.2),
      colorDisabled: baseColor.setAlpha(baseColor.getAlpha() * 0.25),

      ...s,
      // except for base which is already using the right order
      ...base,
    }),
  }

  return res as any
}
