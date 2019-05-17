import { Color, LinearGradient, toColor } from '@o/color'
import { SimpleStyleObject, ThemeObject } from 'gloss'

const darken = (color, amt) => {
  return color.darken(amt(color))
}
const increaseContrast = (color, amt) => {
  const adjustAmt = amt(color)
  return color.isLight() ? color.darken(adjustAmt) : color.lighten(adjustAmt)
}
const decreaseContrast = (color, amt) => {
  const adjustAmt = amt(color)
  return color.isLight() ? color.lighten(adjustAmt) : color.darken(adjustAmt)
}

const roundToExtreme = (color, pct = 20) => {
  const lightness = color.lightness()
  if (lightness <= pct) {
    return '#000'
  }
  if (lightness >= 100 - pct) {
    return '#fff'
  }
  return color
}

const smallAmt = color => {
  // 1 = white, 1 = black, 0 = middle
  const ranged = Math.abs(50 / (50 - color.lightness()))
  // this is 0-0.025
  const small = (ranged + 0.001) * 0.025
  const softened = Math.log(2) - Math.log(2 - (0.1 - small))
  return softened * 1.8
}

const largeAmt = color => smallAmt(color) * 1.25
const opposite = color => {
  return color.isDark()
    ? color.mix(color.lightness(0.1)).lightness(75)
    : color.mix(color.lightness(0.9)).lightness(25)
}

const isPlainObj = o => typeof o == 'object' && o.constructor == Object

const cache = {}

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
  if (cache[bgName]) {
    return cache[bgName]
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
  const key = JSON.stringify(s)
  if (cache[key]) {
    return cache[key]
  }
  const backgroundColored = s.background ? toColor(s.background) : opposite(toColor(s.color))
  // some handy basic styles
  const base = colorize({
    background: backgroundColored,
    color: s.color || roundToExtreme(decreaseContrast(opposite(backgroundColored), largeAmt)),
    borderColor: s.borderColor || increaseContrast(backgroundColored, smallAmt),
  })
  // flattened
  const res: ThemeObject = {
    ...colorize({
      // for buttons/surfaces, we generate a nice set of themes
      colorHover: s.colorHover || base.color.lighten(0.1),
      backgroundHover:
        s.backgroundHover ||
        base.background.lighten((100 / (base.background.lightness() + 1)) * 0.04),
      borderColorHover: s.borderColorHover || increaseContrast(base.borderColor, smallAmt),
      backgroundActiveHover: s.backgroundActiveHover || increaseContrast(base.background, largeAmt),
      backgroundActive: s.backgroundActive || decreaseContrast(base.background, largeAmt),
      borderColorActive: s.borderColorActive || decreaseContrast(base.borderColor, smallAmt),
      backgroundBlur: s.backgroundBlur || darken(base.background, largeAmt),
      colorBlur: s.colorBlur || darken(base.color, largeAmt),
      borderColorBlur: s.borderColorBlur || darken(base.borderColor, largeAmt),
      // focus is not desirable for many things...
      // backgroundFocus: s.backgroundFocus || decreaseContrast(base.background, largeAmt),
      // borderColorFocus: s.borderColorFocus || decreaseContrast(base.borderColor, largeAmt),
      // ensure rest is last so they can override anything
      ...s,
      // except for base which is already using the right order
      ...base,
    }),
  }
  cache[key] = res

  return res as any
}
