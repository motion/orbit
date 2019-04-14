import { Color, toColor } from '@o/color'
import { LinearGradient, ThemeObject } from '@o/css'

type ColorObject = { [a: string]: Color }

export type SimpleStyleObject = {
  color: Color
  background: Color
  borderColor: Color
  [a: string]: Color | ColorObject
}

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
    ? color.mix(color.lightness(0)).lightness(75)
    : color.mix(color.lightness(1)).lightness(25)
}

const isPlainObj = o => typeof o == 'object' && o.constructor == Object

export class ThemeMaker {
  cache = {}

  colorize = (obj): SimpleStyleObject => {
    const res = {}
    for (const key in obj) {
      const val = obj[key]
      if (val instanceof LinearGradient) {
        res[key] = val
        continue
      }
      if (isPlainObj(val)) {
        // recurse into objects
        res[key] = this.colorize(val)
      } else {
        try {
          res[key] = toColor(val)
        } catch {
          res[key] = val
        }
      }
    }
    return res as SimpleStyleObject
  }

  fromColor = (bgName: string): ThemeObject | null => {
    if (typeof bgName !== 'string') {
      return null
    }
    if (this.cache[bgName]) {
      return this.cache[bgName]
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
    return this.fromStyles({ background })
  }

  // generate some properly contrasted colors based on base colors
  // insert theme into psuedo styles for Blur Active and ActiveHighlight
  fromStyles = (s: Partial<SimpleStyleObject>): ThemeObject => {
    if (!s.background && !s.color) {
      throw new Error('Themes require at least background or color')
    }
    const key = JSON.stringify(s)
    if (this.cache[key]) {
      return this.cache[key]
    }
    const backgroundColored = s.background ? toColor(s.background) : opposite(toColor(s.color))
    // some handy basic styles
    const base = this.colorize({
      background: backgroundColored,
      color: s.color || roundToExtreme(decreaseContrast(opposite(backgroundColored), largeAmt)),
      borderColor: s.borderColor || increaseContrast(backgroundColored, smallAmt),
    }) as SimpleStyleObject
    // flattened
    const res = {
      ...this.colorize({
        // for buttons/surfaces, we generate a nice set of themes
        surfaceColorHover: base.color.lighten(0.1),
        surfaceBackgroundHover: base.background.lighten(0.1),
        surfaceBorderColorHover: increaseContrast(base.borderColor, smallAmt),
        surfaceBackgroundActiveHover: increaseContrast(base.background, largeAmt),
        surfaceBackgroundActive: decreaseContrast(base.background, largeAmt),
        surfaceBorderColorActive: decreaseContrast(base.borderColor, smallAmt),
        surfaceBackgroundBlur: darken(base.background, largeAmt),
        surfaceColorBlur: darken(base.color, largeAmt),
        surfaceBorderColorBlur: darken(base.borderColor, largeAmt),
        surfaceBackgroundFocus: decreaseContrast(base.background, largeAmt),
        surfaceBorderColorFocus: decreaseContrast(base.borderColor, largeAmt),
        // ensure rest is last so they can override anything
        ...s,
        // except for base which is already using the right order
        ...base,
      }),
    }
    this.cache[key] = res
    return res as ThemeObject
  }
}
