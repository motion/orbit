import $ from '@mcro/color'
import { Color } from '@mcro/css'

type ColorObject = { [a: string]: Color }

type SimpleStyleObject = {
  [a: string]: Color | ColorObject
  hover?: ColorObject
  active?: ColorObject
  focused?: ColorObject
  inactive?: ColorObject
  disabled?: ColorObject
}

const lighten = {
  true: 'darken',
  false: 'lighten',
}
const darken = {
  true: 'lighten',
  false: 'darken',
}
const str = x => `${x}`
const adjust = (color, adjuster, opposite = false) => {
  const isLight = color.isLight()
  const direction = isLight ? darken[str(opposite)] : lighten[str(opposite)]
  return color[direction](adjuster(color))
}

const smallAmt = color => {
  // 1 = white, 1 = black, 0 = middle
  const ranged = Math.abs(50 / (50 - color.lightness()))
  // this is 0-0.025
  const small = (ranged + 0.001) * 0.025
  const softened = Math.log(2) - Math.log(2 - (0.1 - small))
  return softened * 1.8
}
const smallerAmt = color => smallAmt(color) * 0.25
const largeAmt = color => smallAmt(color) * 1.25
const opposite = color => color.mix(color.lighten(1))

export class ThemeMaker {
  cache = {}

  colorize = (obj): SimpleStyleObject =>
    Object.keys(obj).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]:
          typeof obj[cur] === 'string' || Array.isArray(obj[cur])
            ? $(obj[cur])
            : obj[cur],
      }),
      {},
    )

  fromColor = bgName => {
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

  fromStyles = (styleObject: SimpleStyleObject) => {
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
      color: color || adjust(opposite(backgroundColored), largeAmt),
      borderColor: borderColor || adjust(backgroundColored, smallAmt),
    })
    const hover = {
      color: adjust(base.color, smallerAmt),
      background: adjust(base.background, smallerAmt),
      borderColor: adjust(base.borderColor, smallerAmt),
      ...rest.hover,
    }
    const active = {
      ...base,
      borderColor: adjust(base.borderColor, smallAmt, true),
      ...rest.active,
    }
    const inactive = {
      background: adjust(base.background, smallAmt),
      color: adjust(base.color, smallAmt),
      borderColor: adjust(base.borderColor, smallAmt),
      ...rest.inactive,
    }
    const disabled = {
      background: adjust(base.background, largeAmt),
      color: adjust(base.color, largeAmt),
      borderColor: adjust(base.borderColor, largeAmt),
      ...rest.disabled,
    }
    const focused = {
      background: adjust(base.background, largeAmt, true),
      borderColor: adjust(base.borderColor, largeAmt, true),
      ...rest.focused,
    }
    const res = this.colorize({
      ...rest,
      base,
      hover,
      active,
      inactive,
      disabled,
      focused,
    })
    this.cache[key] = res
    return res
  }
}
