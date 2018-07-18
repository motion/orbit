import $ from '@mcro/color'
import { Color } from '@mcro/css'

type ColorObject = { [a: string]: Color }

type SimpleStyleObject = {
  [a: string]: Color | ColorObject
  hover?: ColorObject
  active?: ColorObject
  highlight?: ColorObject
  focus?: ColorObject
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

const MIN_ADJUST = 0.1
const smallAmt = color =>
  Math.min(0.5, Math.max(MIN_ADJUST, 2 * Math.log(20 / color.lightness()))) // goes 0 #fff to 0.3 #000
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

  fromColor = colorName => {
    if (typeof colorName !== 'string') {
      return null
    }
    if (this.cache[colorName]) {
      return this.cache[colorName]
    }
    let base
    try {
      base = $(colorName)
    } catch (e) {
      if (e.message.indexOf('parse color from string') > -1) {
        return null
      }
      throw e
    }
    const opposite = base.mix(base.lighten(1))
    const theme = this.fromStyles({
      highlightColor: base,
      background: base,
      color: opposite.lighten(1.6),
      borderColor: opposite.darken(0.5),
    })
    this.cache[colorName] = theme // cache
    return theme
  }

  fromStyles = (styleObject: SimpleStyleObject) => {
    if (!styleObject.background && !styleObject.color) {
      throw new Error('Themes require at least background or color')
    }
    const key = JSON.stringify(styleObject)
    if (this.cache[key]) {
      return this.cache[key]
    }
    const {
      highlightColor,
      highlightBackground,
      background,
      color,
      borderColor,
      ...rest
    } = styleObject
    const backgroundColored = background ? $(background) : opposite($(color))
    const base = this.colorize({
      highlightColor,
      highlightBackground,
      background: backgroundColored,
      color: color || opposite(backgroundColored),
      borderColor: borderColor || adjust(backgroundColored, smallAmt),
    })
    const focused = {
      background: base.background && adjust(base.background, largeAmt, true),
      borderColor: base.borderColor && adjust(base.borderColor, largeAmt, true),
    }
    const res = this.colorize({
      ...rest,
      base,
      hover: {
        ...base,
        color: adjust(base.color, smallAmt),
        background: adjust(base.background, smallAmt),
        borderColor: base.borderColor && adjust(base.borderColor, smallAmt),
        ...rest.hover,
      },
      active: {
        ...base,
        ...focused,
        ...rest.active,
      },
      highlight: {
        ...base,
        ...rest.highlight,
      },
    })
    this.cache[key] = res
    return res
  }
}
