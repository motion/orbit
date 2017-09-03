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

  fromStyles = ({
    highlightColor,
    highlightBackground,
    background,
    color,
    borderColor,
    ...rest
  }: Object): Object => {
    const {
      highlightColor: hlColor,
      highlightBackground: hlBackgorund,
      ...styles
    } = this.colorize({
      highlightColor,
      highlightBackground,
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
      Math.min(0.5, Math.max(MIN_ADJUST, 2 * Math.log(20 / color.lightness()))) // goes 0 #fff to 0.3 #000
    const largeAmt = color => smallAmt(color) * 1.25
    const adjust = (color, adjuster, opposite = false) => {
      const isLight = color.lightness() > 50
      const direction = isLight ? darken[str(opposite)] : lighten[str(opposite)]
      return color[direction](adjuster(color))
    }

    const focused = {
      background: adjust(styles.background, largeAmt, true),
      borderColor: adjust(styles.borderColor, largeAmt, true),
    }

    const highlightColorFinal = hlColor || $('#fff')
    const highlightBgFinal = hlBackgorund || highlightColorFinal.negate()
    const highlight = {
      color: highlightColorFinal,
      background: highlightBgFinal,
      borderColor: adjust(highlightBgFinal, largeAmt, true),
    }

    return {
      ...rest,
      base: styles,
      hover: {
        ...styles,
        color: adjust(styles.color, smallAmt),
        background: adjust(styles.background, smallAmt),
        borderColor: adjust(styles.borderColor, smallAmt),
        ...rest.hover,
      },
      active: {
        ...styles,
        ...focused,
        ...rest.active,
      },
      focus: {
        ...styles,
        ...focused,
        ...rest.focus,
      },
      highlight: {
        ...styles,
        ...highlight,
        ...rest.highlight,
      },
    }
  }
}
