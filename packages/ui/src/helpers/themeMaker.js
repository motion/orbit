// @flow
import color from 'color'

export default class ThemeMaker {
  cache = {}

  colorize = (obj: Object) =>
    Object.keys(obj).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: obj[cur] instanceof color ? obj[cur] : color(obj[cur]),
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
      base = color(colorName)
    } catch (e) {
      if (e.message.indexOf('parse color from string') > -1) {
        return null
      }
      throw e
    }

    const opposite = base.mix(base.lighten(10))
    const theme = this.fromStyles({
      highlightColor: base,
      background: base,
      color: opposite.lighten(0.4),
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
    const smallAmt = color => Math.max(0, 5 * Math.log(4 / color.lightness())) // goes 0 #fff to 0.3 #000
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
        color: '#fff',
        background: adjust(obj.background, smallAmt),
        borderColor: adjust(obj.borderColor, smallAmt),
      },
      active: {
        ...obj,
        background: adjust(obj.background, largeAmt, true),
        highlightColor: adjust(obj.highlightColor, largeAmt),
        color: '#fff',
      },
      focus: {
        ...obj,
        background: adjust(obj.background, largeAmt, true),
        borderColor: adjust(obj.highlightColor, smallAmt, true),
      },
      highlight: {
        color: obj.highlightColor,
      },
    }
  }
}
