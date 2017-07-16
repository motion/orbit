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

    return {
      ...rest,
      base: obj,
      hover: {
        ...obj,
        color: '#fff',
        background: obj.background.lighten(0.2),
        borderColor: obj.borderColor.lighten(0.2),
      },
      active: {
        ...obj,
        background: obj.background.darken(0.3),
        highlightColor: obj.highlightColor.lighten(0.3),
        color: '#fff',
      },
      focus: {
        ...obj,
        background: obj.background.lighten(0.25),
        borderColor: obj.highlightColor,
      },
      highlight: {
        color: obj.highlightColor,
      },
    }
  }
}
