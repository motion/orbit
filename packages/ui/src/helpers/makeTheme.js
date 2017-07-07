import color from 'color'

const colorize = obj =>
  Object.keys(obj).reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: obj[cur] instanceof color ? obj[cur] : color(obj[cur]),
    }),
    {}
  )

export default function makeTheme(styles) {
  const obj = colorize(styles)

  return {
    base: obj,
    hover: {
      ...obj,
      color: '#fff',
      background: obj.background.lighten(0.2),
      borderColor: obj.borderColor.lighten(0.2),
    },
    active: {
      ...obj,
      background: obj.background.darken(0.2),
      highlightColor: obj.highlightColor.lighten(0.2),
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
