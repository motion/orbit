import $ from '@mcro/color'
import { Color } from '@mcro/css'
import { ThemeObject } from '../types'

type ColorObject = { [a: string]: Color }

// TODO: change themes to just use `base:{}` not put stuff in global?
type SimpleStyleObject = {
  [a: string]: Color | ColorObject
  hover?: ColorObject
  active?: ColorObject
  focus?: ColorObject
  inactive?: ColorObject
  disabled?: ColorObject
}

const increaseContrast = (color, amt) => {
  const adjustAmt = amt(color)
  return color.isLight() ? color.darken(adjustAmt) : color.lighten(adjustAmt)
}
const decreaseContrast = (color, amt) => {
  const adjustAmt = amt(color)
  return color.isLight() ? color.lighten(adjustAmt) : color.darken(adjustAmt)
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

export class ThemeMaker {
  cache = {}

  colorize = (obj): SimpleStyleObject =>
    Object.keys(obj).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]:
          (typeof obj[cur] === 'string' &&
            !(obj[cur].indexOf('gradient') >= 0)) ||
          Array.isArray(obj[cur])
            ? $(obj[cur])
            : obj[cur],
      }),
      {},
    )

  fromColor = (bgName): ThemeObject => {
    if (typeof bgName !== 'string') {
      return null
    }
    if (this.cache[bgName]) {
      return this.cache[bgName]
    }
    let background
    try {
      background = $(bgName)
    } catch (e) {
      if (e.message.indexOf('parse color from string') > -1) {
        return null
      }
      throw e
    }
    return this.fromStyles({ background })
  }

  fromStyles = (styleObject: SimpleStyleObject): ThemeObject => {
    if (!styleObject.background && !styleObject.color) {
      throw new Error('Themes require at least background or color')
    }
    const key = JSON.stringify(styleObject)
    if (this.cache[key]) {
      return this.cache[key]
    }
    const { background, color, borderColor, ...rest } = styleObject
    const backgroundColored = background ? $(background) : opposite($(color))
    const base = this.colorize({
      background: backgroundColored,
      color: color || decreaseContrast(opposite(backgroundColored), largeAmt),
      borderColor: borderColor || increaseContrast(backgroundColored, smallAmt),
    })
    const hover = {
      color: increaseContrast(base.color, smallAmt),
      background: increaseContrast(base.background, smallAmt),
      borderColor: increaseContrast(base.borderColor, smallAmt),
      ...rest.hover,
    }
    const active = {
      ...base,
      borderColor: decreaseContrast(base.borderColor, smallAmt),
      ...rest.active,
    }
    const inactive = {
      background: increaseContrast(base.background, smallAmt),
      color: increaseContrast(base.color, smallAmt),
      borderColor: increaseContrast(base.borderColor, smallAmt),
      ...rest.inactive,
    }
    const disabled = {
      background: increaseContrast(base.background, largeAmt),
      color: increaseContrast(base.color, largeAmt),
      borderColor: increaseContrast(base.borderColor, largeAmt),
      ...rest.disabled,
    }
    const focus = {
      background: decreaseContrast(base.background, largeAmt),
      borderColor: decreaseContrast(base.borderColor, largeAmt),
      ...rest.focus,
    }
    const res = {
      ...rest,
      ...this.colorize({
        base,
        hover,
        active,
        inactive,
        disabled,
        focus,
      }),
    }
    this.cache[key] = res
    return res as ThemeObject
  }
}
