// @flow
import $ from 'color'

export default class ThemeMaker {
  cache = {}

  colorize = (obj: Object) =>
    Object.keys(obj).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: obj[cur] instanceof $ ? obj[cur] : $(obj[cur]),
      }),
      {}
    )

  fromColor = (colorName: string): Object => {
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
      color: opposite.lighten(0.2),
      borderColor: opposite.darken(0.2),
    })
    this.cache[colorName] = theme // cache
    return theme
  }

  fromStyles = (styles: Object): Object => {
    const { highlightColor, background, color, borderColor, ...rest } = styles
    const obj = this.colorize({
      highlightColor,
      background,
      color,
      borderColor,
    })

    const lighten = {
      true: 'darken',
      false: 'lighten',
    }
    const darken = {
      true: 'lighten',
      false: 'darken',
    }

    const str = x => `${x}`
    const MIN_ADJUST = 0.1
    const smallAmt = color =>
      Math.min(0.5, Math.max(MIN_ADJUST, 5 * Math.log(20 / color.lightness()))) // goes 0 #fff to 0.3 #000
    const largeAmt = color => smallAmt(color) * 1.25
    const adjust = (color, adjuster, opposite = false) => {
      const isLight = color.lightness() > 50
      const direction = isLight ? darken[str(opposite)] : lighten[str(opposite)]
      return color[direction](adjuster(color))
    }

    return {
      ...rest,
      base: obj,
      hover: {
        ...obj,
        color: adjust(obj.color, smallAmt),
        background: adjust(obj.background, smallAmt),
        borderColor: adjust(obj.borderColor, smallAmt),
        ...rest.hover,
      },
      active: {
        ...obj,
        background: adjust(obj.background, largeAmt, true),
        highlightColor: adjust(obj.highlightColor, largeAmt),
        color: adjust(obj.color, largeAmt),
        ...rest.active,
      },
      focus: {
        ...obj,
        background: adjust(obj.background, largeAmt, true),
        borderColor: adjust(obj.highlightColor, smallAmt, true),
        ...rest.focus,
      },
      highlight: {
        color: obj.highlightColor,
        ...rest.highlight,
      },
    }
  }
}
