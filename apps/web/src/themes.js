// @flow
import { color } from '@mcro/ui'

const colorize = obj =>
  Object.keys(obj).reduce(
    (acc, cur) => ({ ...acc, [cur]: color(obj[cur]) }),
    {}
  )

function theme(styles) {
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

const highlightColor = [89, 154, 244]

const LIGHT = {
  highlightColor,
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
  buttonBackground: 'linear-gradient(#fff, #fefefe)',
}

const Theme = {
  clear: {
    button: {
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    glow: {
      color: [255, 255, 255, 0.1],
    },
    ...theme({
      highlightColor,
      background: [255, 255, 255, 0.1],
      color: '#333',
      borderColor: [0, 0, 0, 0.1],
    }),
  },
  dark: theme({
    highlightColor,
    background: '#222',
    color: '#eee',
    borderColor: '#333',
  }),
  'clear-dark': theme({
    highlightColor,
    background: [20, 20, 20, 0],
    color: '#f2f2f2',
    borderColor: [30, 30, 30, 1],
  }),
  light: {
    base: LIGHT,
    hover: {
      ...LIGHT,
      color: color(LIGHT.color).lighten(0.5),
    },
    active: {
      ...LIGHT,
      background: color(LIGHT.background).darken(0.1),
      color: '#000',
      borderColor: '#fff',
    },
    focus: {
      ...LIGHT,
    },
    highlight: {
      color: LIGHT.highlightColor,
    },
  },
}

window.Theme = Theme

export default Theme
