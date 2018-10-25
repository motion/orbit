import colorize from '@mcro/color'
import { Color } from '@mcro/css'
import { ThemeObject } from '@mcro/css'

type ColorObject = { [a: string]: Color }

// TODO: change themes to just use `base:{}` not put stuff in global?
type SimpleStyleObject = {
  [a: string]: Color | ColorObject
  hover?: ColorObject
  active?: ColorObject
  focus?: ColorObject
  blur?: ColorObject
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
      if (isPlainObj(val)) {
        // recurse into objects
        res[key] = this.colorize(val)
      } else {
        try {
          res[key] = colorize(val)
        } catch {
          res[key] = val
        }
      }
    }
    return res
  }

  fromColor = (bgName): ThemeObject => {
    if (typeof bgName !== 'string') {
      return null
    }
    if (this.cache[bgName]) {
      return this.cache[bgName]
    }
    let background
    try {
      background = colorize(bgName)
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
  fromStyles = (styleObject: SimpleStyleObject): ThemeObject => {
    if (!styleObject.background && !styleObject.color) {
      throw new Error('Themes require at least background or color')
    }
    const key = JSON.stringify(styleObject)
    if (this.cache[key]) {
      return this.cache[key]
    }
    const { background, color, borderColor, ...rest } = styleObject
    const backgroundColored = background ? colorize(background) : opposite(colorize(color))
    // some handy basic styles
    const base = this.colorize({
      background: backgroundColored,
      color: color || roundToExtreme(decreaseContrast(opposite(backgroundColored), largeAmt)),
      borderColor: borderColor || increaseContrast(backgroundColored, smallAmt),
    })
    // flattened
    const res = {
      ...this.colorize({
        ...base,
        colorHover: increaseContrast(base.color, smallAmt),
        backgroundHover: increaseContrast(base.background, smallAmt),
        borderColorHover: increaseContrast(base.borderColor, smallAmt),
        backgroundActiveHover: increaseContrast(base.background, largeAmt),
        backgroundActive: decreaseContrast(base.background, largeAmt),
        borderColorActive: decreaseContrast(base.borderColor, smallAmt),
        backgroundBlur: darken(base.background, largeAmt),
        colorBlur: darken(base.color, largeAmt),
        borderColorBlur: darken(base.borderColor, largeAmt),
        backgroundFocus: decreaseContrast(base.background, largeAmt),
        borderColorFocus: decreaseContrast(base.borderColor, largeAmt),
        // ensure rest is last so they can override anything
        ...rest,
      }),
    }
    this.cache[key] = res
    return res as ThemeObject
  }
}
